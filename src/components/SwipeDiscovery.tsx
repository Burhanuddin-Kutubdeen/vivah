
import React from 'react';
import { useDiscoveryProfiles } from '@/hooks/use-discovery-profiles';
import DiscoveryProfileCard from './discovery/DiscoveryProfileCard';
import SwipeActionButtons from './discovery/SwipeActionButtons';
import DiscoveryLoading from './discovery/DiscoveryLoading';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import { useLoadingProgress } from '@/hooks/use-loading-progress';

interface SwipeDiscoveryProps {
  isOffline?: boolean;
  isPremium?: boolean;
}

const SwipeDiscovery: React.FC<SwipeDiscoveryProps> = ({ 
  isOffline = false, 
  isPremium = false 
}) => {
  const {
    currentProfile,
    direction,
    remainingLikes,
    handleSwipe,
    handleSuperLike,
    hasProfiles,
    isLoading,
    error
  } = useDiscoveryProfiles();

  const progress = useLoadingProgress(isLoading);

  if (isLoading) {
    return <DiscoveryLoading progress={progress} />;
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!hasProfiles) {
    return (
      <div className="max-w-md mx-auto text-center p-8">
        <h3 className="text-lg font-medium mb-2">No more profiles</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Check back later for new matches!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto relative">
      {/* Profile Card */}
      <div className="relative mb-6">
        <DiscoveryProfileCard 
          profile={currentProfile} 
          direction={direction}
        />
      </div>

      {/* Action Buttons */}
      <SwipeActionButtons
        onSwipeLeft={() => handleSwipe('left')}
        onSwipeRight={() => handleSwipe('right')}
        onSuperLike={handleSuperLike}
        isOffline={isOffline}
        isPremium={isPremium}
        remainingLikes={remainingLikes}
      />
    </div>
  );
};

export default SwipeDiscovery;
