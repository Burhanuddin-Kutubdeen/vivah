
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useDiscoveryProfiles } from '@/hooks/use-discovery-profiles';
import DiscoveryProfileCard from '@/components/discovery/DiscoveryProfileCard';
import SwipeActionButtons from '@/components/discovery/SwipeActionButtons';
import PremiumUpgradeButton from '@/components/discovery/PremiumUpgradeButton';
import DiscoveryLoadingSkeleton from '@/components/discovery/DiscoveryLoadingSkeleton';

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
  const { 
    currentProfile, 
    direction, 
    remainingLikes, 
    handleSwipe, 
    handleSuperLike 
  } = useDiscoveryProfiles({ isPremium });

  if (isLoading) {
    return <DiscoveryLoadingSkeleton />;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Discovery Mode</h2>
        <div className="flex items-center space-x-2">
          {!isPremium && (
            <span className="text-sm text-matrimony-600 dark:text-matrimony-300">
              {remainingLikes} likes remaining today
            </span>
          )}
        </div>
      </div>
      
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
          onSuperLike={() => isOffline ? null : handleSuperLike()}
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
