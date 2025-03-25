import { useState, useEffect } from 'react';
import { testDateHandling } from '../utils';

const StorageTest = () => {
  const [isStorageWorking, setIsStorageWorking] = useState<boolean | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [testValue, setTestValue] = useState<string>('');

  useEffect(() => {
    testLocalStorage();
  }, []);

  const testLocalStorage = () => {
    try {
      // Clear previous test errors
      setStorageError(null);
      
      // Test localStorage availability
      if (typeof window === 'undefined' || !window.localStorage) {
        setIsStorageWorking(false);
        setStorageError('localStorage is not available in this browser');
        return;
      }

      // Test setting a value
      const testKey = '__storage_test__';
      const testData = 'test-' + Date.now();
      localStorage.setItem(testKey, testData);
      
      // Test retrieving the value
      const retrievedData = localStorage.getItem(testKey);
      
      // Clean up
      localStorage.removeItem(testKey);
      
      // Check if value matches
      if (retrievedData === testData) {
        setIsStorageWorking(true);
        setTestValue(testData);
      } else {
        setIsStorageWorking(false);
        setStorageError(`Data mismatch: expected "${testData}", got "${retrievedData}"`);
      }
    } catch (error) {
      setIsStorageWorking(false);
      setStorageError(error instanceof Error ? error.message : String(error));
    }
  };

  const checkTasksData = () => {
    try {
      const tasksData = localStorage.getItem('tasks');
      console.log('Current tasks data in localStorage:', tasksData);
      alert(tasksData ? `Tasks data exists (${tasksData.length} chars)` : 'No tasks data in localStorage');
    } catch (error) {
      console.error('Error reading tasks data:', error);
      alert(`Error reading tasks: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const clearTasksData = () => {
    try {
      localStorage.removeItem('tasks');
      console.log('Cleared tasks data from localStorage');
      alert('Tasks data cleared from localStorage');
    } catch (error) {
      console.error('Error clearing tasks data:', error);
      alert(`Error clearing tasks: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  const runDateTest = () => {
    try {
      // Run date test with the current date
      testDateHandling();
      
      // Test with example reminder values
      testDateHandling('2023-12-31T23:59');
      
      // Test with a full ISO date string
      testDateHandling(new Date().toISOString());
      
      alert('Date tests completed. Check the console for results.');
    } catch (error) {
      console.error('Error running date tests:', error);
      alert(`Error in date tests: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="fixed bottom-0 right-0 p-4 bg-black/50 backdrop-blur-sm rounded-tl-lg text-sm z-50">
      <h3 className="font-bold mb-2 text-white">Storage Test</h3>
      <div className="flex flex-col gap-2">
        <div>
          Status: {
            isStorageWorking === null ? 'Testing...' :
            isStorageWorking ? '✅ Working' : '❌ Not working'
          }
        </div>
        {storageError && (
          <div className="text-red-400">Error: {storageError}</div>
        )}
        {testValue && (
          <div className="text-xs opacity-75">Test value: {testValue}</div>
        )}
        <div className="flex flex-wrap gap-2 mt-2">
          <button 
            onClick={testLocalStorage}
            className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
          >
            Test Again
          </button>
          <button 
            onClick={checkTasksData}
            className="px-2 py-1 bg-green-500 text-white rounded text-xs"
          >
            Check Tasks
          </button>
          <button 
            onClick={clearTasksData}
            className="px-2 py-1 bg-red-500 text-white rounded text-xs"
          >
            Clear Tasks
          </button>
          <button 
            onClick={runDateTest}
            className="px-2 py-1 bg-purple-500 text-white rounded text-xs"
          >
            Test Dates
          </button>
        </div>
      </div>
    </div>
  );
};

export default StorageTest; 