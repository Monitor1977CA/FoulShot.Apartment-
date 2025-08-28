/**
 * @file services/geminiService.ts
 * @description This file is the central hub for all interactions with the Google Gemini API.
 * It encapsulates the logic for initializing the AI client and provides dedicated, well-documented
 * functions for different AI tasks, such as generating text, creating images, and analyzing image content.
 * This separation of concerns is a key architectural pattern, keeping API logic isolated from UI components.
 */

import { GoogleGenAI, GenerateContentResponse, Type, Chat } from "@google/genai";
import { CanonicalTimeline, TimelineEvaluation, DialogueChunkData } from '../types';

// Ensure the API key is available from Vite env. Do not throw if missing — log and let the app continue.
const API_KEY = (import.meta.env.VITE_API_KEY as string | undefined) || '';
if (!API_KEY) {
  console.warn("Gemini API key (VITE_API_KEY) not set. AI features will be disabled. To enable, create a .env with VITE_API_KEY=your_key and restart the dev server.");
}

// Initialize the Google AI client only if a key is present. Otherwise keep `ai` null and handle gracefully in callers.
const ai: GoogleGenAI | null = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

// Helper function to delay execution, used in the retry logic.
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Pre-defined style prompts for generating images in a modern, photorealistic crime-drama aesthetic.
 * This ensures a consistent visual theme across all generated images in the game.
 */
const REALISTIC_STYLES = {
    monochrome: `Photorealistic, modern crime drama aesthetic. Cinematic lighting, sharp focus, high dynamic range. Gritty, tense atmosphere. Black and white.`,
    selectiveColor: `Photorealistic, modern crime drama aesthetic. Cinematic lighting, sharp focus, high dynamic range. Primarily black and white, with a single key element highlighted in a stark, dramatic color. Gritty, tense atmosphere.`
};

/**
 * Fetches a text-based analytical response from the Gemini model for the AI assistant (ADA).
 * @param {string} prompt - The full prompt containing the AI's persona, context, and the player's action.
 * @returns {Promise<string>} The generated text response from the AI.
 * @throws Will throw an error if the API call fails, which is caught and handled in the calling thunk.
 */
export async function getADAResponse(prompt: string): Promise<string> {
    if (!ai) {
        console.warn('getADAResponse called but Gemini client is not initialized. Returning fallback message.');
        return "ADA unavailable: API key not configured.";
    }

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.7, // A balance between creativity and determinism.
                topP: 0.9,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching ADA response:", error);
        // Re-throw the error to be handled by the calling Redux thunk, which can update the state.
        throw new Error("Communication with analytical core failed.");
    }
}

/**
 * The expected structure of a valid JSON response from the interrogation AI.
 */
export interface InterrogationResponse {
    chunks: DialogueChunkData[];
    nextSuggestedQuestions: string[];
    phaseUpdate: { progressValue: number };
    phaseCompleted?: boolean;
    adaFeedback: string;
}

/**
 * @architectural_note
 * This function is part of a service layer refactor. It isolates the specific logic
 * for handling an interrogation chat turn. This keeps the calling component (`useInterrogationAI` hook)
 * clean and unaware of the implementation details of streaming and JSON parsing.
 *
 * @param chat The active Gemini Chat instance.
 * @param message The message (including context) to send to the AI.
 * @returns A promise resolving to the structured AI response.
 */
export async function getInterrogationResponse(chat: Chat, message: string): Promise<InterrogationResponse> {
    if (!ai) {
        // Return a harmless, empty interrogation response so the UI can continue without crashing.
        console.warn('getInterrogationResponse called but Gemini client is not initialized. Returning empty fallback response.');
        return {
            chunks: [],
            nextSuggestedQuestions: [],
            phaseUpdate: { progressValue: 0 },
            phaseCompleted: false,
            adaFeedback: 'AI unavailable (no API key configured)'
        };
    }

    const responseStream = await chat.sendMessageStream({ message });
    let accumulatedJson = '';
    
    // Accumulate the streaming response into a single string.
    for await (const chunk of responseStream) {
        accumulatedJson += chunk.text;
    }
    
    // Robustly find and parse the JSON object from the AI's response.
    const jsonStart = accumulatedJson.indexOf('{');
    const jsonEnd = accumulatedJson.lastIndexOf('}');

    if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("No valid JSON object found in AI response.");
    }
    
    const jsonString = accumulatedJson.substring(jsonStart, jsonEnd + 1);
    const parsed = JSON.parse(jsonString) as InterrogationResponse;
    
    if (!Array.isArray(parsed.chunks) || !parsed.phaseUpdate || !parsed.adaFeedback) {
        throw new Error("Parsed JSON from AI is missing required fields.");
    }
    
    return parsed;
}


/**
 * Generates an image using the Imagen model with a robust, built-in retry mechanism.
 * This function is critical for handling API rate limits and temporary service outages gracefully.
 *
 * @param {string} prompt - The description of the image to generate.
 * @param {'monochrome' | 'selectiveColor' | 'map'} [colorTreatment='monochrome'] - The visual style to apply.
 * @returns {Promise<{ mimeType: string; bytes: string } | null>} A structured object with image data, or null on failure after all retries.
 */
export async function generateImage(
    prompt: string, 
    colorTreatment: 'monochrome' | 'selectiveColor' | 'map' = 'monochrome'
): Promise<{ mimeType: string; bytes: string } | null> {

    if (!ai) {
        console.warn('generateImage called but Gemini client is not initialized. Skipping image generation.');
        return null;
    }

    const isMap = colorTreatment === 'map';
    
    const request = {
        model: 'imagen-4.0-generate-001',
        prompt: isMap ? prompt : `${REALISTIC_STYLES[colorTreatment]} ${prompt}`,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: isMap ? '16:9' : '3:4',
        }
    };
    
    const maxRetries = 3;
    let exponentialDelay = 2000; // Start with 2 seconds for exponential backoff.

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await ai.models.generateImages(request);
            
            if (response?.generatedImages?.length > 0 && response.generatedImages[0].image?.imageBytes) {
                const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
                return { mimeType: 'image/jpeg', bytes: base64ImageBytes };
            } else {
                console.warn("Unexpected API response for image generation:", JSON.stringify(response, null, 2));
                const failureReason = response?.generatedImages?.[0]?.raiFilteredReason
                    ? `filtered due to ${response.generatedImages[0].raiFilteredReason}`
                    : 'no image data was returned';
                throw new Error(`Image generation succeeded but ${failureReason}.`);
            }
            
        } catch (error: any) {
            const errorMessage = String(error?.message || '');
            const isRateLimitError = errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED');
            const isServiceUnavailable = errorMessage.includes('503');
            const isNoImageDataError = errorMessage.includes('Image generation succeeded but');

            if ((isRateLimitError || isServiceUnavailable || isNoImageDataError) && attempt < maxRetries) {
                let delay = exponentialDelay; // Default to exponential backoff.
                
                if (isRateLimitError) {
                    try {
                        const jsonString = errorMessage.substring(errorMessage.indexOf('{'));
                        const errorJson = JSON.parse(jsonString);
                        const retryInfo = errorJson?.error?.details?.find((d: any) => d['@type'] === 'type.googleapis.com/google.rpc.RetryInfo');
                        
                        // --- ROBUSTNESS FIX: Safely parse retry delay ---
                        if (retryInfo && retryInfo.retryDelay && typeof retryInfo.retryDelay.seconds !== 'undefined') {
                            const suggestedSeconds = Number(retryInfo.retryDelay.seconds);
                            
                            // --- SANITY CHECK: Ignore absurdly long delays ---
                            const MAX_REASONABLE_DELAY_SEC = 300; // 5 minutes
                            if (!isNaN(suggestedSeconds) && suggestedSeconds > 0 && suggestedSeconds < MAX_REASONABLE_DELAY_SEC) {
                                delay = (suggestedSeconds * 1000) + (Math.random() * 500); // Add jitter
                            }
                        }
                    } catch (e) {
                       // Silently fail and use exponential backoff.
                    }
                }

                const reason = isRateLimitError ? 'Rate Limit' : isServiceUnavailable ? 'Service Unavailable' : 'Content Filtered';
                console.log(`API error (${reason}). Retrying image generation in ${Math.round(delay / 1000)}s... (Attempt ${attempt}/${maxRetries})`);
                await sleep(delay);
                
                // Increase the delay for the next attempt.
                exponentialDelay *= 2; 

            } else {
                const finalErrorReason = isRateLimitError ? "Daily quota likely exceeded" : isServiceUnavailable ? "Service unavailable" : isNoImageDataError ? "Content filtering after multiple retries" : "An unknown error";
                let userFriendlyMessage = `Unrecoverable error during image generation on attempt ${attempt} (${finalErrorReason}).`;
                if (isRateLimitError) {
                    userFriendlyMessage += " Check your API plan and billing details. For more info, visit: https://ai.google.dev/gemini-api/docs/rate-limits";
                }
                console.error(userFriendlyMessage, error);
                return null;
            }
        }
    }

    console.error("All image generation retries failed for prompt:", prompt);
    return null;
}

/**
 * Analyzes a provided image to locate specific items and return their coordinates.
 * This uses the multimodal capabilities of Gemini to "see" the image and identify objects,
 * enabling dynamic, interactive environments.
 *
 * @param {string} base64Image - The base64-encoded string of the image to analyze (without the data URL prefix).
 * @param {Array<{ id: string; label: string; hint?: string }>} itemsToFind - An array of items to search for in the image.
 * @returns {Promise<{ [key: string]: { x: number; y: number } } | null>} A map of item IDs to their normalized (0.0-1.0) coordinates, or null on failure.
 */
export async function analyzeImageForHotspots(
    base64Image: string,
    itemsToFind: Array<{ id: string; label: string; hint?: string }>
): Promise<{ [key: string]: { x: number; y: number } } | null> {
    
    if (!ai) {
        console.warn('analyzeImageForHotspots called but Gemini client is not initialized. Returning null.');
        return null;
    }
    
    // This prompt is engineered to be extremely precise and methodical, giving the AI
    // clear, non-negotiable instructions to ensure a reliable and parsable JSON output.
    const prompt = `You are a precise, methodical forensic image analyst. Your sole function is to identify the center coordinates of specific objects in an image.

**CRITICAL INSTRUCTIONS:**
1.  **Analyze the Image:** Examine the provided image carefully.
2.  **Locate Items:** For each item in the "Items to find" list, locate the corresponding object in the image. The 'description' provides a detailed clue of what to look for.
3.  **Output Coordinates:** Return a JSON array where each object represents an item you found.
4.  **JSON Format:** The JSON response MUST be a valid array of objects. Each object must have exactly three properties: "id" (string), "x" (number), and "y" (number).
5.  **Coordinate System:** Coordinates must be normalized, where (0.0, 0.0) is the top-left corner and (1.0, 1.0) is the bottom-right. The coordinates should point to the CENTER of the object.
6.  **Accuracy:** Be precise. If an item is not clearly visible, DO NOT include it in your response. Do not guess.

**Items to find:**
${itemsToFind.map(item => `- id: "${item.id}", description: "${item.hint || item.label}"`).join('\n')}

**Example JSON Response Format:**
[
  { "id": "item_id_1", "x": 0.45, "y": 0.81 },
  { "id": "item_id_2", "x": 0.19, "y": 0.33 }
]`;

    try {
        const imagePart = {
            inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image,
            },
        };

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            x: { type: Type.NUMBER },
                            y: { type: Type.NUMBER }
                        },
                        required: ['id', 'x', 'y']
                    }
                }
            }
        });
        
        const jsonText = response.text.trim();
        const resultArray = JSON.parse(jsonText) as Array<{id: string, x: number, y: number}>;
        
        // Convert the result array into a map for easy, performant O(1) lookups by item ID.
        const resultMap = resultArray.reduce((acc, item) => {
            acc[item.id] = { x: item.x, y: item.y };
            return acc;
        }, {} as { [key: string]: { x: number; y: number } });

        return resultMap;

    } catch (error) {
        console.error("Error analyzing image for hotspots:", error);
        return null;
    }
}

/**
 * Initializes a new, stateful chat session for an interview.
 * @param {string} persona - The system instruction defining the witness's personality.
 * @returns {Chat} A Gemini Chat instance ready for interaction.
 */
export function startInterviewChat(persona: string): Chat {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: persona,
      temperature: 0.8,
      topK: 40,
    },
  });
}

/**
 * Generates a narrative summary of the player's timeline using the AI.
 * @param {any[]} evidenceList - The player's list of evidence, with details.
 * @param {string} suspectName - The name of the accused suspect.
 * @returns {Promise<string>} A narrative summary of the case.
 */
export async function summarizePlayerTimeline(evidenceList: any[], suspectName: string): Promise<string> {
    const prompt = `You are ADA, an AI assistant summarizing a case file. Based ONLY on the following evidence list, write a brief, compelling narrative of what happened, implicating the suspect, ${suspectName}. Tell the story from the perspective of the detective submitting their case. Be concise and impactful.

Evidence Provided:
${evidenceList.map(e => `- ${new Date(e.timestampCollected).toLocaleDateString()}: ${e.name}`).join('\n')}

Your summary:`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { temperature: 0.5 }
        });
        return response.text;
    } catch (error) {
        console.error("Error summarizing timeline:", error);
        return "Could not generate case summary due to a system error.";
    }
}

/**
 * Evaluates the player's submitted timeline against the ground truth using the AI.
 * @param {{ suspectId: string; evidenceIds: string[] }} playerSubmission - The player's accusation.
 * @param {CanonicalTimeline} groundTruth - The correct solution to the case.
 * @param {string} suspectName - The name of the accused suspect.
 * @returns {Promise<TimelineEvaluation | null>} A structured evaluation object or null on failure.
 */
export async function evaluateTimeline(
    playerSubmission: { suspectId: string; evidenceIds: string[] },
    groundTruth: CanonicalTimeline,
    suspectName: string
): Promise<TimelineEvaluation | null> {
    const prompt = `You are a District Attorney's evaluation AI. Your task is to analyze a detective's submitted case file and provide a structured evaluation.

**Ground Truth (The Actual Crime):**
${JSON.stringify(groundTruth, null, 2)}

**Player's Submission:**
${JSON.stringify(playerSubmission, null, 2)}

**Your Task:**
1.  **Compare Suspects:** Check if the player's submitted \`suspectId\` matches the \`culpritId\` in the ground truth.
2.  **Analyze Evidence:**
    -   Identify which of the player's evidence items are part of the ground truth's \`keyEvents\`.
    -   Identify which \`keyEvents\` from the ground truth are MISSING from the player's submission.
    -   Identify any evidence submitted by the player that is IRRELEVANT to the core narrative.
3.  **Calculate Score:** Based on the accuracy of the suspect, the number of correctly identified key events, and the number of irrelevant items, calculate a confidence score from 0 to 100.
4.  **Determine Verdict:**
    -   Score > 85: "Case Accepted"
    -   Score 50-84: "Case Weak"
    -   Score < 50: "Case Rejected"
5.  **Provide Reasoning:** Write a short, sharp paragraph explaining your verdict.
6.  **List Strengths & Weaknesses:** Provide bullet points for strengths (e.g., "Correctly identified the murder weapon") and weaknesses (e.g., "Missed the crucial link between the paint and the hammer").

Your response MUST be a valid JSON object matching the provided schema. Do not include any text outside the JSON object.`;

    const schema: TimelineEvaluation = {
        verdict: 'Case Accepted',
        score: 100,
        reasoning: 'string',
        strengths: ['string'],
        weaknesses: ['string'],
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        verdict: { type: Type.STRING, enum: ['Case Accepted', 'Case Weak', 'Case Rejected'] },
                        score: { type: Type.NUMBER },
                        reasoning: { type: Type.STRING },
                        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ['verdict', 'score', 'reasoning', 'strengths', 'weaknesses']
                }
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as TimelineEvaluation;

    } catch (error) {
        console.error("Error evaluating timeline:", error);
        return null;
    }
}