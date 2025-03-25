/**
 * Formats a Date object to a date-time string suitable for datetime-local input
 */
export const formatDateTimeForInput = (date: Date): string => {
  // Get local ISO string parts
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  // Format as YYYY-MM-DDTHH:MM (format required by datetime-local input)
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Parses a datetime-local input value to a Date object while preserving the local timezone
 */
export const parseDateTimeFromInput = (dateString: string): Date => {
  return new Date(dateString);
};

/**
 * Determines the greeting based on the current time of day
 */
export const determineGreeting = (): string => {
  const date = new Date();
  const currentHour = date.getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return "morning";
  } else if (currentHour >= 12 && currentHour < 18) {
    return "afternoon";
  } else {
    return "evening";
  }
};

/**
 * Formats a date for display in the UI
 */
export const formatDateForDisplay = (date: Date | string | null): string => {
  if (!date) return '';
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Check for invalid date
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    return dateObj.toLocaleString(undefined, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date for display:', error);
    return '';
  }
};

/**
 * Debug utilities for localStorage
 */
export const debugLocalStorage = {
  // Print content of localStorage item to console
  inspect: (key: string) => {
    try {
      const value = localStorage.getItem(key);
      if (!value) {
        console.log(`LocalStorage item "${key}" is not set`);
        return null;
      }
      
      const parsed = JSON.parse(value);
      console.log(`LocalStorage item "${key}":`, parsed);
      return parsed;
    } catch (error) {
      console.error(`Error inspecting localStorage item "${key}":`, error);
      return null;
    }
  },
  
  // Clean up localStorage for debugging
  clear: (keys?: string[]) => {
    try {
      if (keys && keys.length) {
        keys.forEach(key => localStorage.removeItem(key));
        console.log(`Cleared localStorage items:`, keys);
      } else {
        localStorage.clear();
        console.log('Cleared all localStorage items');
      }
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

/**
 * Test date handling for debugging
 */
export const testDateHandling = (dateString?: string) => {
  try {
    console.group("📅 Date Handling Test");
    
    // Test current date
    const now = new Date();
    console.log("Current Date:", now);
    console.log("Current Date ISO:", now.toISOString());
    console.log("Current Date Timezone Offset:", now.getTimezoneOffset());
    
    // Test input formatting
    const formatted = formatDateTimeForInput(now);
    console.log("Formatted for Input:", formatted);
    
    // Test parsing from input
    const parsedBack = new Date(formatted);
    console.log("Parsed from Input:", parsedBack);
    console.log("Parsed ISO:", parsedBack.toISOString());
    
    // Test with provided date string if any
    if (dateString) {
      console.log("\nTesting with provided string:", dateString);
      const dateFromString = new Date(dateString);
      console.log("Date from String:", dateFromString);
      console.log("Date from String ISO:", dateFromString.toISOString());
      console.log("Formatted for Input:", formatDateTimeForInput(dateFromString));
    }
    
    console.groupEnd();
    return {
      now,
      formatted,
      parsedBack
    };
  } catch (error) {
    console.error("Error in date test:", error);
    return null;
  }
}; 