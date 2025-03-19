
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

interface MatchCardActionsProps {
  profileId: string;
  name: string;
}

const MatchCardActions: React.FC<MatchCardActionsProps> = ({ profileId, name }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  const [isMessaging, setIsMessaging] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to like profiles",
        variant: "destructive",
      });
      return;
    }

    // Prevent multiple clicks
    if (isLiking || hasLiked) return;
    
    setIsLiking(true);

    try {
      // Record the like in the database
      const { error } = await supabase
        .from('likes')
        .insert({
          user_id: user.id,
          liked_profile_id: profileId,
          status: 'pending'
        });

      if (error) throw error;

      // Show success toast and update state
      setHasLiked(true);
      toast({
        title: "Interest Shown",
        description: `${name} will be notified of your interest`,
      });
    } catch (error) {
      console.error("Error liking profile:", error);
      toast({
        title: "Error",
        description: "Failed to send like. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLiking(false);
    }
  };

  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to message profiles",
        variant: "destructive",
      });
      return;
    }
    
    // Prevent multiple clicks
    if (isMessaging) return;
    
    setIsMessaging(true);
    
    // Navigate to messages page with specific user conversation
    setTimeout(() => {
      navigate(`/messages?userId=${profileId}&name=${encodeURIComponent(name)}`);
      
      toast({
        title: "Message Request Sent",
        description: `You'll be able to message ${name} once they accept your request`,
      });
      
      setIsMessaging(false);
    }, 500); // Small delay for loading state to show
  };

  return (
    <motion.div 
      className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 px-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Button 
        onClick={handleLike}
        size="sm" 
        disabled={isLiking || hasLiked}
        className={`${
          hasLiked 
            ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200" 
            : "bg-matrimony-100 hover:bg-matrimony-200 text-matrimony-700"
        } rounded-full flex-1 transition-colors duration-300`}
      >
        {isLiking ? (
          <Loader2 size={16} className="mr-1 animate-spin" />
        ) : (
          <Heart size={16} className={`mr-1 ${hasLiked ? "fill-green-500 text-green-500" : ""}`} />
        )}
        {hasLiked ? "Liked" : "Like"}
      </Button>
      
      <Button 
        onClick={handleMessage}
        size="sm" 
        disabled={isMessaging}
        className="bg-matrimony-600 hover:bg-matrimony-700 text-white rounded-full flex-1 transition-colors duration-300"
      >
        {isMessaging ? (
          <Loader2 size={16} className="mr-1 animate-spin" />
        ) : (
          <MessageCircle size={16} className="mr-1" />
        )}
        Message
      </Button>
    </motion.div>
  );
};

export default MatchCardActions;
