import { useEffect, useRef, useState } from 'react';
import { Task } from '../types';

export const useNotifications = (tasks: Task[]) => {
  // Ref to track tasks that have already had notifications shown
  const notifiedTasksRef = useRef<Set<string>>(new Set());
  const [permissionState, setPermissionState] = useState<NotificationPermission | 'unsupported'>('default');

  // Check if notifications are supported
  useEffect(() => {
    if (!('Notification' in window)) {
      setPermissionState('unsupported');
      console.log('This browser does not support notifications');
      return;
    }

    // Set initial permission state
    setPermissionState(Notification.permission);

    // We don't automatically request permission because mobile browsers require user interaction
  }, []);

  // Request notification permission when explicitly asked by the user
  const requestPermission = async () => {
    if (!('Notification' in window)) {
      return false;
    }
    
    try {
      const permission = await Notification.requestPermission();
      setPermissionState(permission);
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  // Check for tasks with reminders that need notifications
  useEffect(() => {
    // If notifications aren't supported or permission denied, don't proceed
    if (permissionState !== 'granted') return;
    
    const checkReminders = () => {
      const now = new Date();
      
      tasks.forEach(task => {
        // Skip if already completed or no reminder/notification
        if (task.completed || !task.reminder || !task.notifyEnabled) return;
        
        // Ensure we have a proper Date object
        const reminderTime = task.reminder instanceof Date 
          ? task.reminder 
          : new Date(task.reminder);
        
        // Generate a unique key for this task and time
        const notificationKey = `${task.id}-${reminderTime.getTime()}`;
        
        // Check if reminder time is now (within the last minute) and we haven't shown a notification yet
        if (
          reminderTime <= now && 
          reminderTime > new Date(now.getTime() - 60000) &&
          !notifiedTasksRef.current.has(notificationKey)
        ) {
          try {
            new Notification('Lock in bro', {
              body: `Don't forget to complete: ${task.text}`,
              icon: '/favicon.ico'
            });
            
            // Mark this task as notified
            notifiedTasksRef.current.add(notificationKey);
          } catch (error) {
            console.error('Error showing notification:', error);
          }
        }
      });
    };

    // Check reminders every 10 seconds for more reliable notifications
    const intervalId = setInterval(checkReminders, 10000);
    checkReminders(); // Check immediately on component mount
    
    return () => clearInterval(intervalId);
  }, [tasks, permissionState]);

  return {
    permissionState,
    requestPermission
  };
};

export default useNotifications;
