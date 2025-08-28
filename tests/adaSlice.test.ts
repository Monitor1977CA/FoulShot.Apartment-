/**
 * @file tests/adaSlice.test.ts
 * @description Unit tests for the ADA (AI assistant) Redux slice.
 * This file demonstrates how to test the reducers and state transitions of the slice in isolation.
 *
 * @developer_note This is a conceptual test file that serves as architectural scaffolding.
 * It assumes a testing environment like Jest is set up and shows how unit tests can be
 * structured for Redux slices within this project.
 */

import { jest, describe, beforeEach, it, expect } from '@jest/globals';

// Mock Redux Toolkit's createAsyncThunk before importing the slice.
// This prevents the actual thunk logic from running in tests.
// The jest.mock call is hoisted, so variables defined in the module scope
// are not available inside the factory. `jest.requireActual` must be called
// inside the factory function to avoid errors.
jest.mock('@reduxjs/toolkit', () => {
  const originalRtk = jest.requireActual('@reduxjs/toolkit');

  // To solve hoisting issues, we define the mock object *inside* the factory.
  const mockThunkForFactory = Object.assign(jest.fn(), {
    pending: { type: 'ada/getResponse/pending' },
    fulfilled: { type: 'ada/getResponse/fulfilled' },
    rejected: { type: 'ada/getResponse/rejected' },
  });

  // To solve the "Spread types may only be created from object types" error,
  // we use Object.assign instead of spread syntax, which is safer for module objects.
  return Object.assign({}, originalRtk, {
    __esModule: true, // Handle ES modules
    createAsyncThunk: jest.fn(() => mockThunkForFactory),
  });
});

// Now that the mock is set up, we can import the slice.
// `getADAResponse` will be the mockThunk we created inside the factory.
import adaReducer, { clearADAMessages, getADAResponse } from '../store/adaSlice';
import { configureStore } from '@reduxjs/toolkit';

describe('adaSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    // This store is not strictly necessary for simple reducer tests but can be
    // useful for integration tests or testing thunks. We'll keep it for consistency.
    store = configureStore({
      reducer: {
        ada: adaReducer,
      },
    });
  });

  const initialState = {
    messages: ["ADA online. Standing by for forensic analysis."],
    isLoading: false,
    error: null,
    hasNewMessages: false,
  };

  it('should handle initial state', () => {
    expect(adaReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle clearADAMessages', () => {
    // First, add a message to the state to make it different from initial
    const previousState = {
      ...initialState,
      messages: [...initialState.messages, "Here is some analysis."],
      hasNewMessages: true,
    };
    
    // Dispatch the clear action
    const actual = adaReducer(previousState, clearADAMessages());

    // Expect the state to be reset to its initial form
    expect(actual).toEqual(initialState);
  });
  
  // Test the extraReducers for pending, fulfilled, and rejected states.
  it('should handle getADAResponse.pending', () => {
    // The action type is derived from our mock, ensuring the reducer will recognize it.
    const action = { type: getADAResponse.pending.type };
    const state = adaReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle getADAResponse.fulfilled', () => {
    const mockResponse = "This is a new insight from ADA.";
    const action = { type: getADAResponse.fulfilled.type, payload: mockResponse };
    const state = adaReducer(initialState, action);
    
    expect(state.isLoading).toBe(false);
    expect(state.hasNewMessages).toBe(true);
    expect(state.messages).toEqual([...initialState.messages, mockResponse]);
  });
  
  it('should handle getADAResponse.rejected', () => {
    const mockError = "Failed to fetch.";
    const action = { type: getADAResponse.rejected.type, payload: mockError };
    const state = adaReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.hasNewMessages).toBe(true);
    expect(state.error).toEqual(mockError);
    expect(state.messages[1]).toContain("Analysis interrupted");
  });

});