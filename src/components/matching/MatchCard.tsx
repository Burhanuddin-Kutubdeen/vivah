
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Match } from '@/hooks/use-matches';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import MatchCardImage from './MatchCardImage';
import MatchCardInfo from './MatchCardInfo';
import MatchCardButtons from './MatchCardButtons';
import { isValidUUID } from '@/utils/validation';
import ProfilePopup from '@/components/profiles/ProfilePopup';

interface MatchCardProps {
  match: Match;
  onLike?: (matchId: string) => void;
  onMessage?: (matchId: string) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onLike, onMessage }) => {
  const { profile, matchDetails } = match;
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent default to avoid navigation
    e.preventDefault();
    e.stopPropagation(); // Also stop propagation
    
    if (!isValidUUID(profile.id)) {
      toast.error("Cannot view profile - invalid ID format");
      return;
    }
    setShowProfile(true);
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
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer"
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

      {showProfile && (
        <ProfilePopup 
          profileId={profile.id} 
          onClose={() => setShowProfile(false)} 
        />
      )}
    </>
  );
};

export default MatchCard;
