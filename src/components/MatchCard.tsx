
import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { isValidUUID } from '@/utils/validation';
import ProfilePopup from '@/components/profiles/ProfilePopup';

interface MatchCardProps {
  match: {
    id: string;
    name: string;
    age: number;
    occupation: string;
    imageUrl: string;
    matchPercentage: number;
    isNewMatch: boolean;
  };
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isValidUUID(match.id)) {
      console.error("Invalid profile ID format:", match.id);
      toast.error("Cannot view profile - invalid ID format");
      return;
    }
    setShowProfile(true);
  };
  
  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isValidUUID(match.id)) {
      toast.error("Cannot message profile - invalid ID format");
      return;
    }
    
    navigate(`/messages?userId=${match.id}&name=${encodeURIComponent(match.name)}`);
    toast.info(`Waiting for ${match.name} to accept your message request`);
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
        <div className="relative">
          {match.isNewMatch && (
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-secondary text-white text-xs font-medium px-2.5 py-1 rounded-full">
                New Match
              </span>
            </div>
          )}
          <div className="h-56 overflow-hidden">
            <img 
              src={match.imageUrl} 
              alt={match.name} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="absolute bottom-3 right-3 bg-white dark:bg-gray-900 rounded-full px-2 py-1 text-xs font-medium text-matrimony-700 dark:text-matrimony-300 shadow-sm">
            {match.matchPercentage}% Match
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-medium text-lg">{match.name}, {match.age}</h3>
          <p className="text-sm text-matrimony-600 dark:text-matrimony-400 mb-4">{match.occupation}</p>
          
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full rounded-full border-matrimony-200 hover:text-matrimony-700 hover:border-matrimony-300 dark:border-gray-700"
              onClick={handleMessage}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              <span>Message</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {showProfile && (
        <ProfilePopup 
          profileId={match.id} 
          onClose={() => setShowProfile(false)} 
        />
      )}
    </>
  );
};

export default MatchCard;
