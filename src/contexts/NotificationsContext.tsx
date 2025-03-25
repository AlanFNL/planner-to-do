import React, { createContext, useEffect, useState, ReactNode } from 'react';

interface NotificationsContextType {
  permissionState: NotificationPermission | 'unsupported';
  requestPermission: () => Promise<boolean>;
}

export const NotificationsContext = createContext<NotificationsContextType>({
  permissionState: 'default',
  requestPermission: async () => false
});

interface NotificationsProviderProps {
  children: ReactNode;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({ children }) => {
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
  }, []);

  // Request notification permission when explicitly asked by the user
  const requestPermission = async (): Promise<boolean> => {
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

  return (
    <NotificationsContext.Provider value={{ 
      permissionState, 
      requestPermission 
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsProvider; 