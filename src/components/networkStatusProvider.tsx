'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { toast } from 'sonner';

interface NetworkStatusContextProps {
  isOnline: boolean;
  wasOffline: boolean;
}

const NetworkStatusContext = createContext<NetworkStatusContextProps | undefined>(undefined);

interface NetworkStatusProviderProps {
  children: ReactNode;
}

export const NetworkStatusProvider: React.FC<NetworkStatusProviderProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(true); // Default to true
  const [wasOffline, setWasOffline] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      const handleOnline = () => {
        setIsOnline(true);
        toast.success('You are back online!');
      };

      const handleOffline = () => {
        setIsOnline(false);
        setWasOffline(true);
        toast.error('You are offline now!');
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // Initial check
      if (!navigator.onLine) {
        handleOffline();
      }

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  return (
    <NetworkStatusContext.Provider value={{ isOnline, wasOffline }}>
      {children}
    </NetworkStatusContext.Provider>
  );
};

export const useNetworkStatus = (): NetworkStatusContextProps => {
  const context = useContext(NetworkStatusContext);
  if (context === undefined) {
    throw new Error('useNetworkStatus must be used within a NetworkStatusProvider');
  }
  return context;
};
