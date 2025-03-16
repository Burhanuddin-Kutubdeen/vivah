
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface DiscoveryLoadingProps {
  progress: number;
}

const DiscoveryLoading: React.FC<DiscoveryLoadingProps> = ({ progress }) => {
  return (
    <div className="container mx-auto max-w-md text-center">
      <h2 className="text-2xl font-bold mb-2">Loading your matches</h2>
      <p className="text-matrimony-600 dark:text-matrimony-300 mb-4">
        Please wait while we find your perfect matches...
      </p>
      <Progress value={progress} className="h-2 mb-6" />
    </div>
  );
};

export default DiscoveryLoading;
