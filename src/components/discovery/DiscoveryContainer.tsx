
import React from 'react';
import DiscoveryModeToggle from '@/components/DiscoveryModeToggle';
import CuratedMatchesGrid from '@/components/CuratedMatchesGrid';
import SwipeDiscovery from '@/components/SwipeDiscovery';
import DiscoveryOfflineAlert from '@/components/discovery/DiscoveryOfflineAlert';

interface DiscoveryContainerProps {
  isOffline: boolean;
  discoveryMode: 'curated' | 'discovery';
  setDiscoveryMode: (mode: 'curated' | 'discovery') => void;
  isPremium: boolean;
}

const DiscoveryContainer: React.FC<DiscoveryContainerProps> = ({
  isOffline,
  discoveryMode,
  setDiscoveryMode,
  isPremium
}) => {
  return (
    <div className="container mx-auto">
      {isOffline && <DiscoveryOfflineAlert />}
      
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
  );
};

export default DiscoveryContainer;
