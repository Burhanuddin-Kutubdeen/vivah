
import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Match } from '@/hooks/use-matches';
import { toast } from 'sonner';

interface MatchCardProps {
  match: Match;
  onLike: (matchId: string) => void;
  onMessage: (matchId: string) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onLike, onMessage }) => {
  const navigate = useNavigate();
  
  const handleViewProfile = () => {
    navigate(`/profile/${match.profile.id}`);
  };
  
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike(match.profile.id);
  };
  
  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMessage(match.profile.id);
    
    // Navigate to messages with this profile
    navigate(`/messages?userId=${match.profile.id}&name=${encodeURIComponent(match.profile.name)}`);
  };

  // Determine shared interests to display (max 3)
  const sharedInterestsToShow = match.matchDetails.sharedInterests.slice(0, 3);

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer"
      onClick={handleViewProfile}
      whileHover={{ 
        y: -5, 
        transition: { duration: 0.2 } 
      }}
    >
      <div className="relative">
        {match.matchDetails.isNewMatch && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-secondary text-white text-xs font-medium px-2.5 py-1 rounded-full">
              New Match
            </span>
          </div>
        )}
        <div className="h-48 overflow-hidden">
          <img 
            src={match.profile.imageUrl} 
            alt={match.profile.name} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <div className="absolute bottom-3 right-3 bg-white dark:bg-gray-900 rounded-full px-2 py-1 text-xs font-medium text-matrimony-700 dark:text-matrimony-300 shadow-sm">
          {match.matchDetails.score}% Match
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-lg">{match.profile.name}, {match.profile.age}</h3>
        <p className="text-sm text-matrimony-600 dark:text-matrimony-400 mb-2">{match.profile.occupation}</p>
        
        {sharedInterestsToShow.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-matrimony-500 dark:text-matrimony-400 mb-1">Shared interests:</p>
            <div className="flex flex-wrap gap-1">
              {sharedInterestsToShow.map((interest, index) => (
                <span key={index} className="bg-matrimony-50 dark:bg-gray-700 text-matrimony-600 dark:text-matrimony-300 text-xs px-2 py-0.5 rounded-full">
                  {interest}
                </span>
              ))}
              {match.matchDetails.sharedInterests.length > 3 && (
                <span className="text-xs text-matrimony-400">
                  +{match.matchDetails.sharedInterests.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 rounded-full border-matrimony-200 hover:text-secondary hover:border-secondary dark:border-gray-700"
            onClick={handleLike}
          >
            <Heart className="h-4 w-4 mr-1" />
            <span>Like</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 rounded-full border-matrimony-200 hover:text-matrimony-700 hover:border-matrimony-300 dark:border-gray-700"
            onClick={handleMessage}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            <span>Message</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default MatchCard;
