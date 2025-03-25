import { useState, useEffect, Dispatch, SetStateAction } from 'react';


function usePersistedState<T>(
  key: string,
  initialValue: T,
  options: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
    onError?: (error: Error) => void;
  } = {}
): [T, Dispatch<SetStateAction<T>>] {

  const serialize = options.serialize || JSON.stringify;
  const deserialize = options.deserialize || JSON.parse;
  const onError = options.onError || console.error;

 
  const [state, setState] = useState<T>(() => {
    try {

      const storedValue = localStorage.getItem(key);
      

      if (storedValue) {
        try {
          return deserialize(storedValue);
        } catch (error) {
         
          console.error(`Error deserializing localStorage value for key "${key}":`, error);
  
          localStorage.removeItem(key);
          return initialValue;
        }
      }
    } catch (error) {
     
      console.error(`Error accessing localStorage for key "${key}":`, error);
    }
    return initialValue;
  });

    useEffect(() => {
    try {
      const serializedState = serialize(state);
      
      localStorage.setItem(key, serializedState);
      
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