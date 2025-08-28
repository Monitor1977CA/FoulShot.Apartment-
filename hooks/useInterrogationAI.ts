/**
 * @file hooks/useInterrogationAI.ts
 * @description A custom hook that encapsulates all logic for managing an AI interrogation chat session.
 *
 * @architectural_decision
 * This hook is a cornerstone of the refactored interrogation module. It adheres to the
 * single-responsibility principle by abstracting away the complexities of interacting
 * with the Gemini API. The UI component (`DialogueCard`) no longer needs to know about
 * `Chat` instances, loading states, or JSON parsing. It simply calls the `sendMessage`
 * function and receives clean, structured data in return. This makes the UI component
 * significantly cleaner and easier to reason about, while also making the AI interaction
 * logic reusable and testable in isolation.
 */
import { useState, useEffect, useRef } from 'react';
import { Chat } from '@google/genai';
import { startInterviewChat, getInterrogationResponse, InterrogationResponse } from '../services/geminiService';

/**
 * Manages the state and communication for an interrogation AI chat.
 * @param persona The system instruction string that defines the AI's personality and rules.
 * @returns An object containing the AI's responding status and a function to send a message.
 */
export const useInterrogationAI = (persona: string) => {
  // Use a ref to store the chat instance so it persists across re-renders without causing them.
  const chatRef = useRef<Chat | null>(null);
  const [isAiResponding, setIsAiResponding] = useState(false);

  // Initialize the chat instance only when the persona changes.
  useEffect(() => {
    if (persona) {
      chatRef.current = startInterviewChat(persona);
    }
  }, [persona]);

  /**
   * Sends a message to the AI and returns the structured response.
   * @param message The text to send to the AI chat.
   * @returns A promise that resolves with the parsed AI response, or null on failure.
   */
  const sendMessage = async (message: string): Promise<InterrogationResponse | null> => {
    if (!chatRef.current) {
      console.error("Interrogation chat not initialized.");
      return null;
    }

    setIsAiResponding(true);
    try {
      const response = await getInterrogationResponse(chatRef.current, message);
      return response;
    } catch (error) {
      console.error("Error getting interrogation response from hook:", error);
      return null; // Return null to allow the UI to handle the error state gracefully.
    } finally {
      setIsAiResponding(false);
    }
  };

  return { sendMessage, isAiResponding };
};