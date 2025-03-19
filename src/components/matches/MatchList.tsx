
import React from 'react';
import { motion } from 'framer-motion';
import MatchCard from '@/components/MatchCard';
import MatchCardActions from './MatchCardActions';
import { useNavigate } from 'react-router-dom';

interface Match {
  id: string;
  name: string;
  age: number;
  occupation: string;
  imageUrl: string;
  matchPercentage: number;
  isNewMatch: boolean;
  interests: string[];
}

interface MatchListProps {
  matches: Match[];
}

const MatchList: React.FC<MatchListProps> = ({ matches }) => {
  const navigate = useNavigate();
  
  const handleViewProfile = (profileId: string) => {
    navigate(`/profile/${profileId}`);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {matches.map((match) => (
        <div key={match.id} className="relative">
          <div 
            onClick={() => handleViewProfile(match.id)} 
            className="cursor-pointer"
          >
            <MatchCard match={match} />
          </div>
          <MatchCardActions profileId={match.id} name={match.name} />
        </div>
      ))}
    </motion.div>
  );
};

export default MatchList;
