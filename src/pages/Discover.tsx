
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedTransition from '@/components/AnimatedTransition';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import CuratedMatchesGrid from '@/components/CuratedMatchesGrid';
import SwipeDiscovery from '@/components/SwipeDiscovery';
import DiscoveryModeToggle from '@/components/DiscoveryModeToggle';

const Discover = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [discoveryMode, setDiscoveryMode] = useState<'curated' | 'discovery'>('curated');
  const [isPremium, setIsPremium] = useState(false); // Would be determined by user subscription status
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

  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-gradient-to-b from-white to-matrimony-50 dark:from-gray-900 dark:to-gray-800">
        <Navbar />

        <main className="pt-24 pb-16 px-4">
          <div className="container mx-auto">
            {isOffline && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Connection Issue</AlertTitle>
                <AlertDescription>
                  You are currently offline. Some features may be limited until your connection is restored.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">Discover</h1>
                <p className="text-matrimony-600 dark:text-matrimony-300">Find your perfect match</p>
              </div>
            </div>

            <DiscoveryModeToggle 
              mode={discoveryMode} 
              onModeChange={setDiscoveryMode} 
              isOffline={isOffline} 
            />

            {discoveryMode === 'curated' ? (
              <CuratedMatchesGrid isOffline={isOffline} />
            ) : (
              <SwipeDiscovery isOffline={isOffline} isPremium={isPremium} />
            )}
          </div>
        </main>

        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default Discover;
