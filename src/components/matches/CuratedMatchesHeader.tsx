
import React from 'react';
import { Button } from "@/components/ui/button";
import { Star } from 'lucide-react';

interface CuratedMatchesHeaderProps {
  lastRefreshDate: Date;
  isOffline: boolean;
}

const CuratedMatchesHeader: React.FC<CuratedMatchesHeaderProps> = ({ 
  lastRefreshDate,
  isOffline 
}) => {
  // Format the date to show day, month name, and year
  const formattedDate = lastRefreshDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long', 
    year: 'numeric'
  });

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">For You</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-matrimony-600 dark:text-matrimony-300">
            Refreshes in: 3 days
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full border-matrimony-200 hover:border-matrimony-300 hover:bg-matrimony-50 dark:border-gray-700"
            disabled={isOffline}
          >
            <Star size={16} className="mr-1" />
            View All
          </Button>
        </div>
      </div>
      
      <p className="text-sm text-matrimony-500 dark:text-matrimony-400 mb-4">
        Last refreshed: {formattedDate} • Sorted by shared interests
      </p>
    </>
  );
};

export default CuratedMatchesHeader;
