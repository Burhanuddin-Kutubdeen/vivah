
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { isValidUUID } from '@/utils/validation';

export const useProfileMessage = (profileId: string) => {
  const [isMessaging, setIsMessaging] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const { user } = useAuth();

  // Check if message request has been sent
  useEffect(() => {
    const checkMessageRequest = async () => {
      if (!user || !isValidUUID(profileId)) return;
      
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
    
    checkMessageRequest();
  }, [user, profileId]);

  const handleMessageRequest = async () => {
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }
    
    // Validate UUID format
    if (!isValidUUID(profileId)) {
      return { success: false, error: "Invalid profile ID format" };
    }
    
    // Prevent multiple clicks or if already sent
    if (isMessaging || messageSent) {
      return { success: false, error: "Already processing or sent" };
    }
    
    setIsMessaging(true);
    
    try {
      // Record the message request using the likes table for now
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
      setIsMessaging(false);
      
      return { success: true };
    } catch (error) {
      console.error("Error sending message request:", error);
      setIsMessaging(false);
      return { success: false, error: "Failed to send message request" };
    }
  };

  return {
    isMessaging,
    messageSent,
    handleMessageRequest
  };
};
