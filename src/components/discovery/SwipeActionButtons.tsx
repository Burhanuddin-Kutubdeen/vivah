
import React from 'react';
import { Heart, X, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SwipeActionButtonsProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSuperLike?: () => void;
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
  const handleDislike = () => {
    if (isOffline) return;
    onSwipeLeft();
  };

  const handleLike = () => {
    // Check if the user can swipe right
    if (isOffline || (!isPremium && remainingLikes <= 0)) {
      return;
    }
    
    // If we can, call the provided handler
    onSwipeRight();
  };

  return (
    <div className="flex items-center justify-center space-x-6 mt-6">
      <Button 
        variant="outline" 
        size="icon" 
        className="h-16 w-16 rounded-full border-matrimony-200 hover:border-red-400 hover:bg-red-50 dark:border-gray-700 dark:hover:border-red-400 dark:hover:bg-gray-800"
        onClick={handleDislike}
        disabled={isOffline}
        aria-label="Dislike"
      >
        <X className="h-8 w-8 text-red-500" />
      </Button>
      
      {isPremium && onSuperLike && (
        <Button 
          variant="outline" 
          size="icon" 
          className="h-16 w-16 rounded-full border-matrimony-200 hover:border-blue-400 hover:bg-blue-50 dark:border-gray-700 dark:hover:border-blue-400 dark:hover:bg-gray-800"
          onClick={onSuperLike}
          disabled={isOffline}
          aria-label="Super Like"
        >
          <Star className="h-8 w-8 text-blue-500" />
        </Button>
      )}
      
      <Button 
        variant="outline" 
        size="icon" 
        className={cn(
          "h-16 w-16 rounded-full border-matrimony-200 hover:border-green-400 hover:bg-green-50 dark:border-gray-700 dark:hover:border-green-400 dark:hover:bg-gray-800",
          !isPremium && remainingLikes <= 0 && "opacity-50 cursor-not-allowed"
        )}
        onClick={handleLike}
        disabled={isOffline || (!isPremium && remainingLikes <= 0)}
        aria-label="Like"
      >
        <Heart className="h-8 w-8 text-green-500" />
      </Button>
    </div>
  );
};

export default SwipeActionButtons;
