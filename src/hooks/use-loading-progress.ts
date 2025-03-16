
import { useState, useEffect } from 'react';

export function useLoadingProgress(isLoading: boolean, initialDuration = 2000) {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, initialDuration / 10);
      
      return () => clearInterval(interval);
    }
  }, [isLoading, initialDuration]);

  return progress;
}
