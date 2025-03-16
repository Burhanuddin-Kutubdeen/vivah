
import React from 'react';
import { Grid2X2, Heart } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Skeleton } from "@/components/ui/skeleton";

interface DiscoveryModeToggleProps {
  mode: 'curated' | 'discovery';
  onModeChange: (mode: 'curated' | 'discovery') => void;
  isOffline: boolean;
  isLoading?: boolean;
}

const DiscoveryModeToggle: React.FC<DiscoveryModeToggleProps> = ({ 
  mode, 
  onModeChange,
  isOffline,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center mb-6">
        <Skeleton className="h-10 w-64" />
      </div>
    );
  }

  return (
    <div className="flex justify-center mb-6">
      <ToggleGroup type="single" value={mode} onValueChange={(value) => value && onModeChange(value as 'curated' | 'discovery')}>
        <ToggleGroupItem 
          value="curated" 
          aria-label="Toggle curated matches"
          disabled={isOffline}
          className="rounded-l-full"
        >
          <Grid2X2 className="h-4 w-4 mr-2" />
          Curated Matches
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="discovery" 
          aria-label="Toggle discovery mode"
          disabled={isOffline}
          className="rounded-r-full"
        >
          <Heart className="h-4 w-4 mr-2" />
          Discovery Mode
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default DiscoveryModeToggle;
