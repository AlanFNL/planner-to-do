import { useCallback, useMemo } from 'react';
import { Task } from '../types';
import usePersistedState from './usePersistedState';

// Helper function to generate UUIDs safely across browsers
// This ensures compatibility with older mobile browsers that don't support crypto.randomUUID()
const generateUUID = (): string => {
  try {
    // Try to use the standard API first
    if (crypto && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch (e) {
    console.warn("crypto.randomUUID() not available, using fallback");
  }
  
  // Fallback implementation for browsers without crypto.randomUUID()
  // This isn't as cryptographically secure but works for our needs
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Helper function to serialize tasks (handles Date objects)
const serializeTasks = (tasks: Task[]): string => {
  try {
    // Make a deep copy and handle Date objects explicitly
    const tasksToStore = tasks.map(task => {
      
      const prepared = {
        ...task,
        // We need to convert Date objects to strings
        reminder: task.reminder instanceof Date 
          ? task.reminder.toISOString() 
          : (task.reminder ? new Date(task.reminder).toISOString() : null)
      };
      
      return prepared;
    });
    
    return JSON.stringify(tasksToStore);
  } catch (e) {
    console.error("Error serializing tasks:", e);
    // Return empty array as fallback
    return "[]";
  }
};

// Helper function to deserialize tasks (handles Date objects)
const deserializeTasks = (json: string): Task[] => {
  try {
    const parsedTasks = JSON.parse(json);
    
    // Convert reminder string back to Date objects if they exist
    return parsedTasks.map((task: any) => {
      
      // Ensure we handle notifyEnabled properly too
      const processed = {
        ...task,
        reminder: task.reminder ? new Date(task.reminder) : null,
        notifyEnabled: typeof task.notifyEnabled === 'boolean' ? task.notifyEnabled : false
      };
      
      return processed;
    });
  } catch (e) {
    console.error("Error deserializing tasks:", e);
    // Return empty array as fallback
    return [];
  }
};

export const useTaskStorage = () => {
  // Use our custom usePersistedState hook instead of useState
  const [tasks, setTasks] = usePersistedState<Task[]>(
    "tasks",
    [], // Default empty array
    {
      serialize: serializeTasks,
      deserialize: deserializeTasks,
      onError: (error) => console.error("🛑 Task storage error:", error)
    }
  );
  
  // Use useCallback for task operations to prevent unnecessary renders
  const addTask = useCallback((newTaskText: string, reminderDate: Date | null, notifyEnabled: boolean) => {
    try {
      
      const newTaskObj: Task = {
        id: generateUUID(),
        text: newTaskText,
        completed: false,
        reminder: reminderDate,
        notifyEnabled: notifyEnabled && !!reminderDate
      };
      
      
      setTasks(prev => {
        const newTasks = [...prev, newTaskObj];
        return newTasks;
      });
      
      return newTaskObj;
    } catch (error) {
      console.error("🛑 Error adding task:", error);
      return null;
    }
  }, [setTasks]);

  const updateTask = useCallback((
    id: string, 
    updates: Partial<Omit<Task, 'id'>>
  ) => {
    try {
      
      setTasks(prev => {
        const newTasks = prev.map(task => 
          task.id === id ? { ...task, ...updates } : task
        );
        return newTasks;
      });
      
    } catch (error) {
      console.error(`🛑 Error updating task ${id}:`, error);
    }
  }, [setTasks]);

  const deleteTask = useCallback((id: string) => {
    try {
      
      setTasks(prev => {
        const newTasks = prev.filter(task => task.id !== id);
        return newTasks;
      });
      
    } catch (error) {
      console.error(`🛑 Error deleting task ${id}:`, error);
    }
  }, [setTasks]);

  const toggleComplete = useCallback((id: string) => {
    try {
      
      setTasks(prev => {
        const newTasks = prev.map(task => 
          task.id === id ? { ...task, completed: !task.completed } : task
        );
        return newTasks;
      });
      
    } catch (error) {
      console.error(`🛑 Error toggling completion for task ${id}:`, error);
    }
  }, [setTasks]);

  // Calculate derived values
  const pendingTasks = useMemo(() => tasks.filter(task => !task.completed), [tasks]);
  const completedTasks = useMemo(() => tasks.filter(task => task.completed), [tasks]);

  return {
    tasks,
    pendingTasks,
    completedTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete
  };
};

export default useTaskStorage; 