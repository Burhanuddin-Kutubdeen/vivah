
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useOnlineStatus() {
  const [isOffline, setIsOffline] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check connection status on mount
    const handleOnlineStatus = () => {
      setIsOffline(false);
      toast({
        title: "Connection restored",
        description: "You're back online. Profile discovery is active.",
      });
    };

    const handleOfflineStatus = () => {
      setIsOffline(true);
      toast({
        title: "Connection issue",
        description: "You appear to be offline. Some features may be limited.",
        variant: "destructive",
      });
    };

    // Add event listeners for online/offline status
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOfflineStatus);
    
    // Check initial status
    if (!navigator.onLine) {
      setIsOffline(true);
    }

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOfflineStatus);
    };
  }, [toast]);

  return isOffline; // Return just the boolean value
}
