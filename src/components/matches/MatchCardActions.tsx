
import React, { useState, useEffect } from 'react';
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
  const [messageSent, setMessageSent] = useState(false);
  
  // Check if the user has already liked this profile
  useEffect(() => {
    const checkExistingLike = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('likes')
          .select('status')
          .eq('user_id', user.id)
          .eq('liked_profile_id', profileId)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error("Error checking like status:", error);
          return;
        }
        
        if (data) {
          setHasLiked(true);
        }
      } catch (error) {
        console.error("Error in checkExistingLike:", error);
      }
    };
    
    // Also check if message request has been sent
    const checkMessageRequest = async () => {
      if (!user) return;
      
      try {
        // For now, we'll use likes as a proxy for message requests
        const { data, error } = await supabase
          .from('likes')
          .select('status')
          .eq('user_id', user.id)
          .eq('liked_profile_id', profileId)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error("Error checking message status:", error);
          return;
        }
        
        if (data) {
          setMessageSent(true);
        }
      } catch (error) {
        console.error("Error in checkMessageRequest:", error);
      }
    };
    
    checkExistingLike();
    checkMessageRequest();
  }, [user, profileId]);

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

  const handleMessage = async (e: React.MouseEvent) => {
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
    if (isMessaging || messageSent) return;
    
    setIsMessaging(true);
    
    try {
      // Record the message request using the likes table for now
      // In a real implementation, we would create a separate message_requests table
      const { error } = await supabase
        .from('likes')
        .upsert({
          user_id: user.id,
          liked_profile_id: profileId,
          status: 'pending'
        }, { onConflict: 'user_id,liked_profile_id' });
        
      if (error) throw error;
      
      // Set message sent state
      setMessageSent(true);
        
      // Navigate to messages page with specific user conversation
      navigate(`/messages?userId=${profileId}&name=${encodeURIComponent(name)}`);
      
      toast({
        title: "Message Request Sent",
        description: `You'll be able to message ${name} once they accept your request`,
      });
    } catch (error) {
      console.error("Error sending message request:", error);
      toast({
        title: "Error",
        description: "Failed to send message request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsMessaging(false);
    }
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
        className={`${
          messageSent
            ? "bg-matrimony-100 text-matrimony-700 hover:bg-matrimony-200"
            : "bg-matrimony-600 hover:bg-matrimony-700 text-white"
        } rounded-full flex-1 transition-colors duration-300`}
      >
        {isMessaging ? (
          <Loader2 size={16} className="mr-1 animate-spin" />
        ) : (
          <MessageCircle size={16} className="mr-1" />
        )}
        {messageSent ? "Request Sent" : "Message"}
      </Button>
    </motion.div>
  );
};

export default MatchCardActions;
