
import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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
  
  const handleCardClick = () => {
    // Navigate to a profile view page
    navigate(`/profile-view/${match.id}`);
  };
  
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    if (!user) {
      toast.error("Please log in to like profiles");
      return;
    }
    
    try {
      // Store the like in the database
      const { error } = await supabase
        .from('likes')
        .upsert({
          user_id: user.id,
          liked_profile_id: match.id,
          status: 'pending',
          created_at: new Date().toISOString()
        }, { onConflict: 'user_id, liked_profile_id' });
      
      if (error) {
        console.error("Error storing like:", error);
        toast.error("Failed to like profile");
        return;
      }
      
      toast.success(`Notification sent to ${match.name}`);
    } catch (error) {
      console.error("Error liking profile:", error);
      toast.error("Something went wrong");
    }
  };
  
  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    toast.info(`Waiting for ${match.name} to accept your message request`);
    // In a real app, we would navigate to the messages page
    // navigate('/messages/${match.id}');
  };

  return (
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
