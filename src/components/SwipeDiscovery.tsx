
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useDiscoveryProfiles } from '@/hooks/use-discovery-profiles';
import DiscoveryProfileCard from '@/components/discovery/DiscoveryProfileCard';
import SwipeActionButtons from '@/components/discovery/SwipeActionButtons';
import PremiumUpgradeButton from '@/components/discovery/PremiumUpgradeButton';
import DiscoveryLoadingSkeleton from '@/components/discovery/DiscoveryLoadingSkeleton';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import PreferencesFilter from '@/components/discovery/PreferencesFilter';

interface SwipeDiscoveryProps {
  isOffline: boolean;
  isPremium?: boolean;
  isLoading?: boolean;
}

const SwipeDiscovery: React.FC<SwipeDiscoveryProps> = ({ 
  isOffline, 
  isPremium = false, 
  isLoading = false 
}) => {
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<{
    interests: string[];
    ageRange: [number, number];
    religion?: string;
    civilStatus?: string;
  }>({
    interests: [],
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
    applyPreferences
  } = useDiscoveryProfiles({ isPremium, preferences });

  const handleApplyPreferences = (newPreferences: typeof preferences) => {
    setPreferences(newPreferences);
    applyPreferences(newPreferences);
    setShowPreferences(false);
  };

  if (isLoading) {
    return <DiscoveryLoadingSkeleton />;
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
        
        {!isPremium && (
          <PremiumUpgradeButton isOffline={isOffline} />
        )}
      </div>
    </div>
  );
};

export default SwipeDiscovery;
