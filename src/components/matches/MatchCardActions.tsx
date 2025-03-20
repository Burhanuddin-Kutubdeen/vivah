
import React from 'react';
import { motion } from 'framer-motion';
import LikeButton from './LikeButton';
import MessageButton from './MessageButton';

interface MatchCardActionsProps {
  profileId: string;
  name: string;
}

const MatchCardActions: React.FC<MatchCardActionsProps> = ({ profileId, name }) => {
  return (
    <motion.div 
      className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 px-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <LikeButton profileId={profileId} name={name} />
      <MessageButton profileId={profileId} name={name} />
    </motion.div>
  );
};

export default MatchCardActions;
