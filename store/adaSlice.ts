/**
 * @file store/adaSlice.ts
 * @description This Redux slice manages the state for the AI assistant, ADA.
 * It handles the list of messages, loading and error states for API calls,
 * and whether there are new, unread messages.
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getADAResponse as fetchADAResponse } from '../services/geminiService';
import { ADA_CONFIG } from '../config';

// The maximum number of messages to keep in ADA's log. This is a performance and memory
// optimization to prevent the messages array from growing indefinitely during a long play session.
const MAX_MESSAGES = ADA_CONFIG.MAX_MESSAGES;

/**
 * Defines the shape of the ADA state.
 */
interface ADAState {
  messages: string[]; // The list of analysis messages from ADA.
  isLoading: boolean; // True when an API call is in progress.
  error: string | null; // Stores any error message from the API call.
  hasNewMessages: boolean; // True if there are new messages the user hasn't seen yet.
}

/**
 * The initial state for the ADA slice.
 */
const initialState: ADAState = {
  messages: ["ADA online. Standing by for forensic analysis."],
  isLoading: false,
  error: null,
  hasNewMessages: false,
};

/**
 * An async thunk to fetch a response from the Gemini API.
 * This abstracts the API call logic and handles the async lifecycle (pending, fulfilled, rejected).
 */
export const getADAResponse = createAsyncThunk<string, string, { rejectValue: string }>(
  'ada/getResponse',
  async (prompt, { rejectWithValue }) => {
    try {
      const response = await fetchADAResponse(prompt);
      return response;
    } catch (error: any) {
      // The `rejectWithValue` function is used to return a standard payload on failure.
      return rejectWithValue(error.message || 'An unknown error occurred with the AI.');
    }
  }
);

const adaSlice = createSlice({
  name: 'ada',
  initialState,
  reducers: {
    /**
     * Adds a system-generated message directly to ADA's log.
     * This is for immediate, non-debounced feedback (e.g., "New lead discovered!").
     * @param {string} action.payload The message text to add.
     */
    addADAMessage(state, action: PayloadAction<string>) {
        state.messages.push(action.payload);
        state.hasNewMessages = true;
         if (state.messages.length > MAX_MESSAGES) {
          state.messages.shift();
        }
    },
    /**
     * Marks all of ADA's messages as read, typically when the user opens the ADA panel.
     * This is used to control the notification indicator on the FAB.
     */
    markMessagesAsRead(state) {
      state.hasNewMessages = false;
    },
    /**
     * Clears the current analysis log and resets it to the initial message.
     * This is a crucial UX feature, called when the user navigates to a new card or view,
     * to avoid confusion from seeing ADA's analysis of a previous screen.
     */
    clearADAMessages(state) {
        state.messages = [...initialState.messages];
        state.isLoading = false;
        state.error = null;
        state.hasNewMessages = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getADAResponse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getADAResponse.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.hasNewMessages = true;
        state.messages.push(action.payload);
        // Prune the message history if it exceeds the maximum length.
        if (state.messages.length > MAX_MESSAGES) {
          state.messages.shift();
        }
      })
      .addCase(getADAResponse.rejected, (state, action) => {
        state.isLoading = false;
        state.hasNewMessages = true;
        const errorMessage = action.payload || 'Failed to get a response from ADA.';
        state.error = errorMessage;
        state.messages.push("Analysis interrupted. A data corruption error occurred.");
         if (state.messages.length > MAX_MESSAGES) {
          state.messages.shift();
        }
      });
  },
});

export const { addADAMessage, markMessagesAsRead, clearADAMessages } = adaSlice.actions;
export default adaSlice.reducer;
