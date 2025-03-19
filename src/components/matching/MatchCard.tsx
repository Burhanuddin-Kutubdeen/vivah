
import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import { Match } from '@/hooks/use-matches';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface MatchCardProps {
  match: Match;
  onLike?: (matchId: string) => void;
  onMessage?: (matchId: string) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onLike, onMessage }) => {
  const { profile, matchDetails } = match;
  const navigate = useNavigate();
  
  const handleMessage = () => {
    if (onMessage) {
      onMessage(profile.id);
    } else {
      // Navigate to messages page with this specific conversation open
      navigate(`/messages?userId=${profile.id}&name=${encodeURIComponent(profile.name)}`);
      toast(`Starting conversation with ${profile.name}`, {
        description: "Waiting for them to accept your message request"
      });
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
    >
      <div className="relative">
        {matchDetails.isNewMatch && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-secondary text-white text-xs font-medium px-2.5 py-1 rounded-full">
              New Match
            </span>
          </div>
        )}
        <div className="h-56 overflow-hidden">
          <img 
            src={profile.imageUrl} 
            alt={profile.name} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <div className="absolute bottom-3 right-3 bg-white dark:bg-gray-900 rounded-full px-2 py-1 text-xs font-medium text-matrimony-700 dark:text-matrimony-300 shadow-sm">
          {matchDetails.score}% Match
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-lg">{profile.name}, {profile.age}</h3>
        <p className="text-sm text-matrimony-600 dark:text-matrimony-400 mb-2">{profile.location || 'Location not specified'}</p>
        
        {matchDetails.sharedInterests.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-matrimony-500 mb-1">Shared Interests:</p>
            <div className="flex flex-wrap gap-1">
              {matchDetails.sharedInterests.slice(0, 3).map((interest, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="text-xs"
                >
                  {interest}
                </Badge>
              ))}
              {matchDetails.sharedInterests.length > 3 && (
                <Badge 
                  variant="outline"
                  className="text-xs"
                >
                  +{matchDetails.sharedInterests.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        <div className="flex space-x-2 mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 rounded-full border-matrimony-200 hover:text-secondary hover:border-secondary dark:border-gray-700"
            onClick={() => onLike && onLike(profile.id)}
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
