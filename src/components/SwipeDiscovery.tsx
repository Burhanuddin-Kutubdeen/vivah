
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useDiscoveryProfiles } from '@/hooks/use-discovery-profiles';
import DiscoveryProfileCard from '@/components/discovery/DiscoveryProfileCard';
import SwipeActionButtons from '@/components/discovery/SwipeActionButtons';
import PremiumUpgradeButton from '@/components/discovery/PremiumUpgradeButton';
import DiscoveryLoadingSkeleton from '@/components/discovery/DiscoveryLoadingSkeleton';
import { Button } from '@/components/ui/button';
import { Filter, Loader2 } from 'lucide-react';
import PreferencesFilter from '@/components/discovery/PreferencesFilter';
import { DiscoveryProfilePreferences } from '@/types/discovery';
import { toast } from "sonner";

interface SwipeDiscoveryProps {
  isOffline: boolean;
  isPremium?: boolean;
  isLoading?: boolean;
}

const SwipeDiscovery: React.FC<SwipeDiscoveryProps> = ({ 
  isOffline, 
  isPremium = false, 
  isLoading: parentLoading = false 
}) => {
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<DiscoveryProfilePreferences>({
    ageRange: [18, 60],
    religion: undefined,
    civilStatus: undefined
  });
  
  const { 
    currentProfile, 
    direction, 
    remainingLikes, 
    handleSwipe, 
    handleSuperLike,
    applyPreferences,
    hasProfiles,
    isLoading: profilesLoading
  } = useDiscoveryProfiles({ isPremium, preferences });

  const isLoading = parentLoading || profilesLoading;

  const handleApplyPreferences = (newPreferences: DiscoveryProfilePreferences) => {
    setPreferences(newPreferences);
    applyPreferences(newPreferences);
    setShowPreferences(false);
    
    // Show a feedback toast to inform the user
    toast.success("Preferences applied successfully");
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-matrimony-500 mx-auto mb-4" />
            <p className="text-matrimony-600 dark:text-matrimony-300">Loading profiles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Swipe Mode</h2>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setShowPreferences(!showPreferences)}
          >
            <Filter className="h-4 w-4" />
            Preferences
          </Button>
          {!isPremium && (
            <span className="text-sm text-matrimony-600 dark:text-matrimony-300">
              {remainingLikes} likes remaining today
            </span>
          )}
        </div>
      </div>
      
      {showPreferences && (
        <PreferencesFilter 
          initialPreferences={preferences}
          onApply={handleApplyPreferences}
          onCancel={() => setShowPreferences(false)}
        />
      )}
      
      <div className="flex flex-col items-center">
        {hasProfiles ? (
          <>
            <AnimatePresence mode="wait">
              <DiscoveryProfileCard 
                profile={currentProfile} 
                direction={direction} 
              />
            </AnimatePresence>
            
            <SwipeActionButtons 
              onSwipeLeft={() => isOffline ? null : handleSwipe('left')}
              onSwipeRight={() => isOffline ? null : handleSwipe('right')}
              isOffline={isOffline}
              isPremium={isPremium}
              remainingLikes={remainingLikes}
            />
          </>
        ) : (
          <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-xl shadow-sm my-8">
            <h3 className="text-xl font-medium mb-2">No Profiles Found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              We couldn't find any profiles matching your current preferences or there may not be any other users registered yet.
            </p>
            <Button 
              onClick={() => {
                setPreferences({
                  ageRange: [18, 60],
                  religion: undefined,
                  civilStatus: undefined
                });
                applyPreferences({
                  ageRange: [18, 60],
                  religion: undefined,
                  civilStatus: undefined
                });
                toast.info("Preferences have been reset");
              }} 
              variant="outline"
            >
              Reset Preferences
            </Button>
          </div>
        )}
        
        {!isPremium && hasProfiles && (
          <PremiumUpgradeButton isOffline={isOffline} />
        )}
      </div>
    </div>
  );
};

export default SwipeDiscovery;
