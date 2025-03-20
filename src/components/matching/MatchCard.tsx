
import React from 'react';
import { motion } from 'framer-motion';
import { Match } from '@/hooks/use-matches';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import MatchCardImage from './MatchCardImage';
import MatchCardInfo from './MatchCardInfo';
import MatchCardButtons from './MatchCardButtons';
import { isValidUUID } from '@/utils/validation';

interface MatchCardProps {
  match: Match;
  onLike?: (matchId: string) => void;
  onMessage?: (matchId: string) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onLike, onMessage }) => {
  const { profile, matchDetails } = match;
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/profile-view/${profile.id}`);
  };
  
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    if (!isValidUUID(profile.id)) {
      toast.error("Cannot like profile - invalid ID format");
      return;
    }
    
    if (onLike) {
      onLike(profile.id);
    }
  };
  
  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    if (!isValidUUID(profile.id)) {
      toast.error("Cannot message profile - invalid ID format");
      return;
    }
    
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
      onClick={handleCardClick}
    >
      <MatchCardImage 
        imageUrl={profile.imageUrl}
        name={profile.name}
        isNewMatch={matchDetails.isNewMatch}
        matchPercentage={matchDetails.score}
      />

      <MatchCardInfo
        name={profile.name}
        age={profile.age}
        location={profile.location}
        sharedInterests={matchDetails.sharedInterests}
      />
      
      <div className="px-4 pb-4">
        <MatchCardButtons 
          onLike={handleLike}
          onMessage={handleMessage}
        />
      </div>
    </motion.div>
  );
};

export default MatchCard;
