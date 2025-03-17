
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { discoveryProfiles } from '@/data/discovery-profiles';
import { UseDiscoveryProfilesOptions, DiscoveryProfile } from '@/types/discovery';
import { applyAllFilters } from '@/utils/profile-filters';
import { getUserGender } from '@/utils/user-utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useDiscoveryProfiles({ isPremium, preferences }: UseDiscoveryProfilesOptions) {
  const [filteredProfiles, setFilteredProfiles] = useState<DiscoveryProfile[]>([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [remainingLikes, setRemainingLikes] = useState(isPremium ? Infinity : 10);
  const { user } = useAuth();
  const hasProfiles = filteredProfiles.length > 0;

  // Filter and sort profiles based on preferences and heterosexual matching
  useEffect(() => {
    // Get user gender from auth context
    const userGender = getUserGender(user);
    
    // Apply all filters based on user preferences
    const matchedProfiles = applyAllFilters(discoveryProfiles, userGender, preferences);
    console.log("Applied filters with preferences:", preferences);
    console.log("Matched profiles count:", matchedProfiles.length);
    
    setFilteredProfiles(matchedProfiles);
    setCurrentProfileIndex(0); // Reset to first profile after filtering
  }, [preferences, user]);

  // Current profile to display
  const currentProfile = filteredProfiles[currentProfileIndex] || null;

  // Function to notify a liked profile
  const notifyProfileLiked = async (likedProfile: DiscoveryProfile) => {
    try {
      if (!user) return;
      
      // In a real app, we would send this to a database table or notification system
      // For this demo, we'll just log and show a toast
      console.log(`${user.email} liked ${likedProfile.name}'s profile`);
      
      // This simulates sending the notification to the liked profile
      // In a real app, we would store this in a database
      toast.success(`Notification sent to ${likedProfile.name}`);
      
      // In a production app with a proper backend, we would:
      // 1. Create a "likes" or "matches" table in the database
      // 2. Store the user ID and liked profile ID
      // 3. Have a notification system to alert the liked profile
    } catch (error) {
      console.error("Error sending like notification:", error);
    }
  };

  const handleSwipe = (dir: 'left' | 'right') => {
    setDirection(dir);
    
    // If swiping right (like) and not premium, reduce remaining likes
    if (dir === 'right' && !isPremium) {
      setRemainingLikes(prev => Math.max(0, prev - 1));
      
      // When swiping right, notify the profile that was liked
      if (currentProfile) {
        notifyProfileLiked(currentProfile);
      }
    }
    
    // Wait for animation to complete before changing the profile
    setTimeout(() => {
      if (currentProfileIndex < filteredProfiles.length - 1) {
        setCurrentProfileIndex(prev => prev + 1);
      } else {
        setCurrentProfileIndex(0); // Loop back to the first profile
      }
      setDirection(null);
    }, 300);
  };

  const handleSuperLike = () => {
    if (!isPremium) return;
    
    // Logic for super like
    console.log('Super liked:', currentProfile?.name);
    
    // Also notify on super likes
    if (currentProfile) {
      notifyProfileLiked(currentProfile);
    }
    
    // Move to next profile
    setTimeout(() => {
      if (currentProfileIndex < filteredProfiles.length - 1) {
        setCurrentProfileIndex(prev => prev + 1);
      } else {
        setCurrentProfileIndex(0);
      }
    }, 300);
  };
  
  // Function to apply new preferences directly
  const applyPreferences = (newPreferences: typeof preferences) => {
    // The effect will handle the actual filtering
    console.log('Applying preferences:', newPreferences);
  };

  return {
    currentProfile,
    direction,
    remainingLikes,
    handleSwipe,
    handleSuperLike,
    applyPreferences,
    hasProfiles
  };
}
