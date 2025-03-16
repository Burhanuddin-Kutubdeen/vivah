
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const DiscoveryLoadingSkeleton: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-40" />
      </div>
      
      <div className="flex flex-col items-center">
        <Skeleton className="h-[500px] w-full max-w-md mb-6 rounded-3xl" />
        
        <div className="flex items-center justify-center space-x-4 mt-6">
          <Skeleton className="h-14 w-14 rounded-full" />
          <Skeleton className="h-14 w-14 rounded-full" />
          <Skeleton className="h-14 w-14 rounded-full" />
        </div>
        
        <Skeleton className="h-8 w-64 mt-4" />
      </div>
    </div>
  );
};

export default DiscoveryLoadingSkeleton;
