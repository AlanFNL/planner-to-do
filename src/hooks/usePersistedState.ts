import { useState, useEffect, Dispatch, SetStateAction } from 'react';

/**
 * Custom hook for persisting state in localStorage with verification
 * @param key The key to store the state under in localStorage
 * @param initialValue The initial value for the state
 * @param options Optional configuration
 * @returns [state, setState] tuple similar to useState
 */
function usePersistedState<T>(
  key: string,
  initialValue: T,
  options: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
    onError?: (error: Error) => void;
  } = {}
): [T, Dispatch<SetStateAction<T>>] {
  // Default serialization/deserialization
  const serialize = options.serialize || JSON.stringify;
  const deserialize = options.deserialize || JSON.parse;
  const onError = options.onError || console.error;

  // Create state but don't initialize from localStorage yet
  const [state, setState] = useState<T>(() => {
    try {
      // Try to load from localStorage
      const storedValue = localStorage.getItem(key);
      
      // If value exists, try to parse it
      if (storedValue) {
        try {
          return deserialize(storedValue);
        } catch (error) {
          // If deserialization fails, log the error and use initialValue
          console.error(`Error deserializing localStorage value for key "${key}":`, error);
          // Remove corrupted data
          localStorage.removeItem(key);
          return initialValue;
        }
      }
    } catch (error) {
      // If localStorage is not available, log error and use initialValue
      console.error(`Error accessing localStorage for key "${key}":`, error);
    }
    return initialValue;
  });

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    try {
      // Skip the initial render if localStorage already has a value
      const currentValue = localStorage.getItem(key);
      
      // Try to serialize the current state
      const serializedState = serialize(state);
      
      // Store in localStorage
      localStorage.setItem(key, serializedState);
      
      // Verify that the value was stored correctly
      const storedValue = localStorage.getItem(key);
      
      if (storedValue !== serializedState) {
        throw new Error(`Value verification failed. Expected "${serializedState}", got "${storedValue}"`);
      }
      
      console.log(`Successfully saved state to localStorage key "${key}"`);
    } catch (error) {
      onError(error instanceof Error ? error : new Error(String(error)));
    }
  }, [key, state, serialize, onError]);

  return [state, setState];
}

export default usePersistedState; 