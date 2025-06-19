
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from "@/services/api";
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
        const likes = await api.likes.getByUser(user.id);
        const hasLikedProfile = likes.some((like: any) => like.liked_profile_id === profileId);
        setHasLiked(hasLikedProfile);
      } catch (error) {
        console.error("Error checking like status:", error);
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
        await api.likes.delete(profileId);
        setHasLiked(false);
        setIsLiking(false);
        return { success: true, action: 'unliked' };
      } else {
        await api.likes.create(profileId);
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
