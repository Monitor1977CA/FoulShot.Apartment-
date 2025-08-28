/**
 * @file hooks/useDebounce.ts
 * @description This file contains a custom React hook for debouncing function calls.
 */

import { useRef, useEffect, useCallback } from 'react';

/**
 * Creates a debounced function that delays invoking `func` until after `delay`
 * milliseconds have elapsed since the last time the debounced function was invoked.
 * This hook is crucial for preventing expensive operations (like API calls) from
 * being triggered too frequently in response to rapid user input.
 *
 * @template F - The type of the function to be debounced.
 * @param {F} func - The function to debounce.
 * @param {number} delay - The number of milliseconds to delay.
 * @returns {(...args: Parameters<F>) => void} - The new debounced function.
 */
export function useDebounce<F extends (...args: any[]) => any>(
  func: F,
  delay: number
): (...args: Parameters<F>) => void {
  // `timeoutRef` stores the ID of the `setTimeout` timer. Using a ref ensures
  // that this value persists across re-renders without causing the component to re-render itself.
  const timeoutRef = useRef<number | null>(null);

  // `funcRef` stores the latest version of the `func` passed to the hook.
  // This is important because if the component re-renders with a new function instance
  // (e.g., due to dependencies in a `useCallback`), we want the debounced function
  // to call the *latest* version, not the one from when it was first created.
  const funcRef = useRef(func);
  useEffect(() => {
    funcRef.current = func;
  }, [func]);

  // Cleanup effect to clear any pending timeout when the component unmounts.
  // This prevents memory leaks and unexpected function calls after the component is gone.
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // `useCallback` memoizes the debounced function itself. This ensures that consumers
  // of this hook receive a stable function instance, preventing unnecessary re-renders in child components.
  const debouncedFunc = useCallback(
    (...args: Parameters<F>) => {
      // If there's a pending timeout, clear it. This is the core of debouncing:
      // resetting the delay timer on each new call.
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }

      // Set a new timeout. The function will only be called after `delay` ms
      // have passed without another call to `debouncedFunc`.
      timeoutRef.current = window.setTimeout(() => {
        funcRef.current(...args);
      }, delay);
    },
    [delay] // The debounced function only needs to be re-created if the delay changes.
  );

  return debouncedFunc;
}