/**
 * @file store/errorLogSlice.ts
 * @description A new Redux slice to manage the state for the error logging system.
 * It provides a central place to store and manage errors caught by the global error handlers.
 */

import { createSlice, PayloadAction, createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { ErrorLogEntry } from '../types';
import { RootState } from './index';
import { v4 as uuidv4 } from 'uuid'; // A library to generate unique IDs

const errorLogAdapter = createEntityAdapter<ErrorLogEntry>();

interface ErrorLogState {
  errors: ReturnType<typeof errorLogAdapter.getInitialState>;
  hasNewErrors: boolean;
}

const initialState: ErrorLogState = {
  errors: errorLogAdapter.getInitialState(),
  hasNewErrors: false,
};

const errorLogSlice = createSlice({
  name: 'errorLog',
  initialState,
  reducers: {
    logError: (state, action: PayloadAction<{ message: string; stack?: string }>) => {
      const { message, stack } = action.payload;
      const newError: ErrorLogEntry = {
        id: uuidv4(),
        message,
        stack,
        timestamp: new Date().toISOString(),
      };
      errorLogAdapter.addOne(state.errors, newError);
      state.hasNewErrors = true;
    },
    markErrorsAsRead: (state) => {
      state.hasNewErrors = false;
    },
    clearErrorLog: (state) => {
      errorLogAdapter.removeAll(state.errors);
      state.hasNewErrors = false;
    },
  },
});

export const { logError, markErrorsAsRead, clearErrorLog } = errorLogSlice.actions;

const { selectAll } = errorLogAdapter.getSelectors((state: RootState) => state.errorLog.errors);

export const selectAllErrors = createSelector(
  [selectAll],
  (errors): ErrorLogEntry[] => errors
);

export const selectHasNewErrors = (state: RootState) => state.errorLog.hasNewErrors;

export default errorLogSlice.reducer;