
import React from 'react';
import { Heart, X, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SwipeActionButtonsProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSuperLike: () => void;
  isOffline: boolean;
  isPremium: boolean;
  remainingLikes: number;
}

const SwipeActionButtons: React.FC<SwipeActionButtonsProps> = ({
  onSwipeLeft,
  onSwipeRight,
  onSuperLike,
  isOffline,
  isPremium,
  remainingLikes
}) => {
  return (
    <div className="flex items-center justify-center space-x-4 mt-6">
      <Button 
        variant="outline" 
        size="icon" 
        className="h-14 w-14 rounded-full border-matrimony-200 hover:border-red-400 hover:bg-red-50 dark:border-gray-700 dark:hover:border-red-400 dark:hover:bg-gray-800"
        onClick={onSwipeLeft}
        disabled={isOffline}
      >
        <X className="h-6 w-6 text-red-500" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        className={cn(
          "h-14 w-14 rounded-full border-matrimony-200 hover:border-blue-400 hover:bg-blue-50 dark:border-gray-700 dark:hover:border-blue-400 dark:hover:bg-gray-800",
          !isPremium && "opacity-50 cursor-not-allowed"
        )}
        onClick={onSuperLike}
        disabled={isOffline || !isPremium}
      >
        <Star className="h-6 w-6 text-blue-500" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        className={cn(
          "h-14 w-14 rounded-full border-matrimony-200 hover:border-green-400 hover:bg-green-50 dark:border-gray-700 dark:hover:border-green-400 dark:hover:bg-gray-800",
          !isPremium && remainingLikes <= 0 && "opacity-50 cursor-not-allowed"
        )}
        onClick={onSwipeRight}
        disabled={isOffline || (!isPremium && remainingLikes <= 0)}
      >
        <Heart className="h-6 w-6 text-green-500" />
      </Button>
    </div>
  );
};

export default SwipeActionButtons;
