
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { isValidUUID } from '@/utils/validation';

export const useProfileLike = (profileId: string) => {
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const { user } = useAuth();

  // Check if the user has already liked this profile
  useEffect(() => {
    const checkExistingLike = async () => {
      if (!user) return;
      
      // For numeric IDs (sample profiles), just return false
      if (/^\d+$/.test(profileId)) {
        setHasLiked(false);
        return;
      }
      
      // Only check database for valid UUIDs
      if (!isValidUUID(profileId)) return;
      
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
    
    checkExistingLike();
  }, [user, profileId]);

  const handleLike = async () => {
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }
    
    // For numeric IDs (sample profiles), just simulate success
    if (/^\d+$/.test(profileId)) {
      setHasLiked(true);
      return { success: true };
    }

    // Validate UUID format for real profiles
    if (!isValidUUID(profileId)) {
      return { success: false, error: "Invalid profile ID format" };
    }

    // Prevent multiple clicks
    if (isLiking) {
      return { success: false, error: "Already processing" };
    }
    
    setIsLiking(true);

    try {
      // If already liked, unlike the profile
      if (hasLiked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('liked_profile_id', profileId);

        if (error) throw error;

        // Update state
        setHasLiked(false);
        setIsLiking(false);
        
        return { success: true, action: 'unliked' };
      } else {
        // Record the like in the database
        const { error } = await supabase
          .from('likes')
          .insert({
            user_id: user.id,
            liked_profile_id: profileId,
            status: 'pending'
          });

        if (error) throw error;

        // Update state
        setHasLiked(true);
        setIsLiking(false);
        
        return { success: true, action: 'liked' };
      }
    } catch (error) {
      console.error("Error liking/unliking profile:", error);
      setIsLiking(false);
      return { success: false, error: "Failed to process action" };
    }
  };

  return {
    isLiking,
    hasLiked,
    handleLike
  };
};
