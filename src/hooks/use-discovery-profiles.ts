
import { useState, useEffect, useCallback } from 'react';
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
  
  // Define currentProfile here to avoid variable use before declaration
  const currentProfile = filteredProfiles[currentProfileIndex] || null;

  // Filter and sort profiles based on preferences and heterosexual matching
  useEffect(() => {
    // Get user gender from auth context
    const userGender = getUserGender(user);
    
    // Apply all filters based on user preferences
    const matchedProfiles = applyAllFilters(discoveryProfiles, userGender, preferences);
    console.log("Applied filters with preferences:", preferences);
    console.log("Matched profiles count:", matchedProfiles.length);
    
    // Sort profiles by shared interests if user has interests
    const userInterests = user?.user_metadata?.interests || 
                         user?.user_metadata?.profile?.interests || 
                         [];
                         
    if (userInterests && userInterests.length > 0) {
      matchedProfiles.sort((a, b) => {
        const aInterests = a.interests.filter(interest => 
          userInterests.includes(interest)).length;
        const bInterests = b.interests.filter(interest => 
          userInterests.includes(interest)).length;
        return bInterests - aInterests; // Descending order
      });
    }
    
    setFilteredProfiles(matchedProfiles);
    setCurrentProfileIndex(0); // Reset to first profile after filtering
  }, [preferences, user]);

  // Function to notify a liked profile
  const notifyProfileLiked = useCallback(async (likedProfile: DiscoveryProfile) => {
    try {
      if (!user) return;
      
      console.log(`${user.email} liked ${likedProfile.name}'s profile`);
      
      // Store the like in the database
      const { error } = await supabase
        .from('likes')
        .upsert({
          user_id: user.id,
          liked_profile_id: likedProfile.id,
          status: 'pending',
          created_at: new Date().toISOString()
        }, { onConflict: 'user_id, liked_profile_id' });
      
      if (error) {
        console.error("Error storing like:", error);
        return;
      }
      
      toast.success(`Notification sent to ${likedProfile.name}`);
      
    } catch (error) {
      console.error("Error sending like notification:", error);
    }
  }, [user]);

  const handleSwipe = useCallback((dir: 'left' | 'right') => {
    setDirection(dir);
    
    // If swiping right (like) and not premium, reduce remaining likes
    if (dir === 'right') {
      if (!isPremium) {
        setRemainingLikes(prev => Math.max(0, prev - 1));
      }
      
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
  }, [currentProfileIndex, filteredProfiles.length, isPremium, currentProfile, notifyProfileLiked]);

  const handleSuperLike = useCallback(() => {
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
  }, [currentProfile, currentProfileIndex, filteredProfiles.length, isPremium, notifyProfileLiked]);
  
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
