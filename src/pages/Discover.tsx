
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedTransition from '@/components/AnimatedTransition';
import { useAuth } from '@/contexts/AuthContext';
import DiscoveryLoading from '@/components/discovery/DiscoveryLoading';
import DiscoveryContainer from '@/components/discovery/DiscoveryContainer';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { useLoadingProgress } from '@/hooks/use-loading-progress';

const Discover = () => {
  const [discoveryMode, setDiscoveryMode] = useState<'curated' | 'discovery'>('curated');
  const [isPremium, setIsPremium] = useState(false); // Would be determined by user subscription status
  const [isLoading, setIsLoading] = useState(true);
  const isOffline = useOnlineStatus();
  const progress = useLoadingProgress(isLoading);
  const { checkProfileCompletion, user } = useAuth();

  // Perform profile check on mount
  useEffect(() => {
    const verifyProfile = async () => {
      if (user) {
        try {
          await checkProfileCompletion(user.id);
          setIsLoading(false);
        } catch (error) {
          console.error("Error checking profile:", error);
          // Even on error, we should stop loading after a timeout
          setTimeout(() => setIsLoading(false), 1000);
        }
      } else {
        setIsLoading(false);
      }
    };
    
    verifyProfile();
    
    // Set a maximum timeout for loading state
    const timeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        console.log("Loading timed out, showing content anyway");
      }
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [user, checkProfileCompletion]);

  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-gradient-to-b from-white to-matrimony-50 dark:from-gray-900 dark:to-gray-800">
        <Navbar />

        <main className="pt-24 pb-16 px-4">
          {isLoading ? (
            <DiscoveryLoading progress={progress} />
          ) : (
            <DiscoveryContainer 
              isOffline={isOffline}
              discoveryMode={discoveryMode}
              setDiscoveryMode={setDiscoveryMode}
              isPremium={isPremium}
            />
          )}
        </main>

        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default Discover;
