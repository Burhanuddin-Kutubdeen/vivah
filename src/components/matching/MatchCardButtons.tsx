
import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface MatchCardButtonsProps {
  onLike: () => void;
  onMessage: () => void;
}

const MatchCardButtons: React.FC<MatchCardButtonsProps> = ({ onLike, onMessage }) => {
  return (
    <div className="flex space-x-2 mt-3">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex-1 rounded-full border-matrimony-200 hover:text-secondary hover:border-secondary dark:border-gray-700"
        onClick={onLike}
      >
        <Heart className="h-4 w-4 mr-1" />
        <span>Like</span>
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex-1 rounded-full border-matrimony-200 hover:text-matrimony-700 hover:border-matrimony-300 dark:border-gray-700"
        onClick={onMessage}
      >
        <MessageCircle className="h-4 w-4 mr-1" />
        <span>Message</span>
      </Button>
    </div>
  );
};

export default MatchCardButtons;
