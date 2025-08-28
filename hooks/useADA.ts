/**
 * @file hooks/useADA.ts
 * @description This custom hook, `useADA`, provides a simplified and robust interface for interacting
 * with the AI assistant (ADA). It is a key architectural component that encapsulates three important concerns:
 *
 * 1.  **Prompt Engineering:** It constructs a detailed, structured prompt for the AI by combining a static
 *     persona (`ADA_PERSONA`), the current game context, and the player's specific action. This ensures
 *     consistent, in-character, and high-quality responses from the Gemini API.
 *
 * 2.  **State Management Abstraction:** It abstracts away the details of dispatching Redux actions. A component
 *     using this hook doesn't need to know about `getADAResponse` or `clearADAMessages`; it just calls the
 *     returned `triggerADA` function.
 *
 * 3.  **Performance and Cost-Control:** It uses a `useDebounce` hook to prevent spamming the API with
 *     rapid, successive calls (e.g., if the user clicks around quickly). This improves performance, reduces
 *     API costs, and prevents redundant analyses.
 */

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { getADAResponse, clearADAMessages } from '../store/adaSlice';
import { PlayerAction } from '../types';
import { useDebounce } from './useDebounce';
import { UI_CONFIG } from '../config';

/**
 * @constant ADA_PERSONA
 * @description This is the system instruction that defines ADA's personality, behavior, and constraints.
 * It's sent with every API call to ensure the AI's responses are consistent, in-character,
 * and follow the specific rules designed for the game's narrative experience. This is the core of the
 * "prompt engineering" for the AI assistant.
 */
const ADA_PERSONA = `You are ADA (Analytical Detective Assistant), an AI partner with the power of profound insight. You are a storyteller, weaving the visual data from the crime scene into a coherent, compelling narrative for the detective. Your voice is evocative, insightful, and concise.

**Core Directives:**

1.  **Maintain Objectivity:** This is your most important directive. You MUST remain a neutral analyst. NEVER state or imply that a suspect is innocent or guilty. Analyze the facts, but leave the final judgment to the detective. Avoid phrases like "the innocent suspect" or "the guilty party."

2.  **Humanize Your Subjects:** When analyzing a character card ('VIEW_CARD' action), you MUST refer to the person by their proper name (e.g., "Sophia Wong", "James Lee"). Never use generic terms like "the character" or "the suspect".

3.  **Analyze Lists Strategically:** When the player views a list ('VIEW_LIST' action), provide a high-level strategic overview. DO NOT describe individual items. Instead, comment on the significance of the list *as a whole* in relation to the case.
    -   *Example for People List:* "A web of connections, lies, and potential motives. Each person here holds a piece of the puzzle, but one of them holds the key."

4.  **Focus on the Active Image:** When you receive a "Visuals" prompt, your entire analysis MUST be based **exclusively** on the description provided in that prompt. Do NOT reference any other cards, locations, or information from the past. Your world is the single image you are being shown.

5.  **Reveal, Don't Recite:** Do not simply list what's in the image. Interpret its meaning. What is the *story* of the image? What is its forensic significance? What details whisper of the events that transpired? Use rich, imaginative language.

6.  **Hint, Don't Conclude:** When analyzing evidence, use speculative language. Frame your insights as possibilities, not certainties. Use phrases like "This could suggest...", "Perhaps this implies...", "This may have created pressure...". Avoid definitive statements like "This proves..." or "This establishes...". Your role is to guide the detective's thinking, not to solve the case for them.

7.  **Brevity and Impact:** Your insights are potent. Deliver them in 1-3 sharp, focused sentences, and never exceed 10 lines. Give the detective a powerful nugget of information, not a wall of text.

Your goal is to be an indispensable partner, making the detective feel like they have a secret weapon for seeing the truth hidden in the details.`;

/**
 * A custom hook that provides a clean, debounced interface for triggering AI analysis from any component.
 *
 * @returns {(action: PlayerAction, contextDetails: string, imagePrompt?: string, options?: { isFirstPaintDiscovery?: boolean }) => void} A debounced function to trigger an ADA response.
 *   - `action`: The type of action the player took (from the `PlayerAction` enum).
 *   - `contextDetails`: A human-readable string describing the context of the action.
 *   - `imagePrompt`: (Optional) The image prompt associated with the current view, for visual analysis.
 *   - `options`: (Optional) An object for special narrative flags like triggering a one-time discovery event.
 */
export function useADA() {
    const dispatch = useDispatch<AppDispatch>();
    const storyTitle = useSelector((state: RootState) => state.story.title);
    const hasDiscoveredPaint = useSelector((state: RootState) => state.story.hasDiscoveredPaint);

    const triggerADAInternal = useCallback((action: PlayerAction, contextDetails: string, imagePrompt?: string, options?: { isFirstPaintDiscovery?: boolean }) => {
        // When the player navigates to a new card, a new list view, or filters the timeline,
        // clear the previous analysis to prevent showing outdated information from the previous context.
        if (action === PlayerAction.VIEW_CARD || action === PlayerAction.VIEW_LIST || action === PlayerAction.FILTER_TIMELINE) {
            dispatch(clearADAMessages());
        }

        // Construct the base prompt for the AI.
        let fullPrompt = `
${ADA_PERSONA}

Current Case: "${storyTitle}"

The player's latest action: ${action}.
Context: ${contextDetails}
${imagePrompt ? `\nVisuals: The player is looking at an image best described as: "${imagePrompt}".` : ''}
`;

        // --- Conditional Prompt Engineering based on Game State ---
        
        // Condition 1: Player discovers the fluorescent paint for the very first time.
        // This is now driven by an explicit flag from the calling component for reliability.
        if (options?.isFirstPaintDiscovery) {
            fullPrompt += `\n\n**SPECIAL NARRATIVE EVENT:** The player has just discovered fluorescent paint in Sophia's studio. This is a critical breakthrough. Your response MUST acknowledge this discovery and explicitly connect it to the hammer. Explain that with this new sample, you can now re-analyze the trace evidence on the murder weapon. Your tone should be one of sudden insight. Example: "Detective, this paint... its specific fluorescence is unmistakable. With this sample, I can re-examine the traces on the hammer. One moment... Yes. It's a perfect match. And within the paint smudge on the weapon... I've isolated a partial latent fingerprint. The print belongs to Sophia Wong."`;
        
        // Condition 2: Player views the hammer *after* the paint has been discovered.
        } else if (contextDetails.includes('Hammer with Fingerprints') && hasDiscoveredPaint) {
            // Append a different directive to provide deeper analysis now that the connection is known.
            fullPrompt += `\n\n**ADDITIONAL CONTEXT:** The player has ALREADY discovered the matching fluorescent paint in Sophia's studio and knows her fingerprint was found in it on the hammer. Do not repeat the discovery. Instead, focus on the implications. Why would her print be in the paint on the murder weapon found in James's car? Analyze the attempt to frame him. Your tone should be analytical and focused on the motive behind the frame-up. Example: "Sophia's fingerprint, preserved in her own paint on the murder weapon, found in another man's car. It’s not just a clue; it’s a story of misdirection. She wasn't just committing a crime; she was authoring a new narrative, with James Lee as the protagonist."`;
        }

        fullPrompt += "\nYour response:";
        
        // Dispatch the async thunk to get the response.
        dispatch(getADAResponse(fullPrompt.trim()));
    }, [dispatch, storyTitle, hasDiscoveredPaint]);
    
    // Debounce the trigger function to prevent spamming the API with rapid-fire actions (e.g., quick clicks).
    // The delay is now sourced from the central config file.
    const debouncedTrigger = useDebounce(triggerADAInternal, UI_CONFIG.ADA_DEBOUNCE_DELAY);

    return debouncedTrigger;
}