
import React from 'react';
import { Button } from "@/components/ui/button";

interface PremiumUpgradeButtonProps {
  isOffline: boolean;
}

const PremiumUpgradeButton: React.FC<PremiumUpgradeButtonProps> = ({ isOffline }) => {
  return (
    <div className="mt-4 text-center">
      <Button 
        variant="secondary" 
        size="sm" 
        className="rounded-full text-xs"
        disabled={isOffline}
      >
        Upgrade to Premium for Unlimited Likes
      </Button>
    </div>
  );
};

export default PremiumUpgradeButton;
