
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UseDiscoveryProfilesOptions, DiscoveryProfile } from '@/types/discovery';
import { applyAllFilters } from '@/utils/profile-filters';
import { getUserGender } from '@/utils/user-utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { calculateAge } from '@/utils/profile-utils';

// Key for storing remaining likes in localStorage
const REMAINING_LIKES_KEY = 'matrimony_remaining_likes';

export function useDiscoveryProfiles({ isPremium, preferences }: UseDiscoveryProfilesOptions) {
  const [filteredProfiles, setFilteredProfiles] = useState<DiscoveryProfile[]>([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const { user } = useAuth();
  const hasProfiles = filteredProfiles.length > 0;
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize remaining likes from localStorage or default to 10
  const [remainingLikes, setRemainingLikes] = useState<number>(() => {
    if (isPremium) return Infinity;
    
    const storedLikes = localStorage.getItem(REMAINING_LIKES_KEY);
    return storedLikes ? parseInt(storedLikes, 10) : 10;
  });
  
  // Define currentProfile here to avoid variable use before declaration
  const currentProfile = filteredProfiles[currentProfileIndex] || null;

  // Save remaining likes to localStorage whenever it changes
  useEffect(() => {
    if (!isPremium && remainingLikes !== Infinity) {
      localStorage.setItem(REMAINING_LIKES_KEY, remainingLikes.toString());
    }
  }, [remainingLikes, isPremium]);

  // Fetch real profiles from the database
  useEffect(() => {
    const fetchProfiles = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Get current user's gender to fetch opposite gender
        const userGender = getUserGender(user);
        const oppositeGender = userGender === 'male' ? 'female' : 'male';
        
        // Fetch profiles with the opposite gender from the database
        const { data: profilesData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('gender', oppositeGender)
          .neq('id', user.id); // Don't include the current user
        
        if (error) {
          console.error('Error fetching profiles:', error);
          toast.error('Failed to load profiles');
          setFilteredProfiles([]);
          setIsLoading(false);
          return;
        }
        
        if (!profilesData || profilesData.length === 0) {
          console.log('No profiles found');
          setFilteredProfiles([]);
          setIsLoading(false);
          return;
        }
        
        // Fetch user's dislikes to filter them out
        const { data: dislikesData, error: dislikesError } = await supabase
          .from('likes')
          .select('liked_profile_id')
          .eq('user_id', user.id)
          .eq('status', 'disliked');
          
        if (dislikesError) {
          console.error('Error fetching dislikes:', dislikesError);
        }
        
        // Create a set of disliked profile IDs for faster lookup
        const dislikedProfileIds = new Set(
          dislikesData?.map(dislike => dislike.liked_profile_id) || []
        );
        
        console.log(`Found ${dislikedProfileIds.size} disliked profiles to filter out`);
        
        // Filter out disliked profiles
        const filteredProfilesData = profilesData.filter(
          profile => !dislikedProfileIds.has(profile.id)
        );
        
        // Convert database profiles to DiscoveryProfile format
        const discoveryProfiles: DiscoveryProfile[] = filteredProfilesData.map(profile => {
          const age = profile.date_of_birth ? calculateAge(profile.date_of_birth) : 25;
          return {
            id: profile.id,
            name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous',
            age,
            gender: profile.gender || 'unknown',
            occupation: profile.job || 'Not specified',
            location: profile.location || 'Not specified',
            interests: profile.interests || [],
            bio: profile.bio || 'No bio available',
            imageUrl: profile.avatar_url || '/placeholder.svg',
            isOnline: false, // Would need real-time status
            lastActive: 'Recently', // Would need last activity tracking
            religion: profile.religion || undefined,
            civilStatus: profile.civil_status || undefined
          };
        });
        
        console.log(`Fetched ${discoveryProfiles.length} real profiles from database`);
        
        // Apply filters based on preferences
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
      } catch (error) {
        console.error('Unexpected error fetching profiles:', error);
        toast.error('Something went wrong while loading profiles');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfiles();
  }, [preferences, user]);

  // Function to record a like or dislike in the database
  const recordInteraction = useCallback(async (
    profileId: string, 
    status: 'pending' | 'disliked'
  ) => {
    try {
      if (!user || !profileId) return false;
      
      // Ensure the ID is a valid UUID before storing in the database
      if (!profileId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        console.error("Invalid profile ID format. Expected UUID format.");
        return false;
      }
      
      // Store the interaction in the database
      const { error } = await supabase
        .from('likes')
        .upsert({
          user_id: user.id,
          liked_profile_id: profileId,
          status: status,
          created_at: new Date().toISOString()
        }, { onConflict: 'user_id, liked_profile_id' });
      
      if (error) {
        console.error("Error storing interaction:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error recording interaction:", error);
      return false;
    }
  }, [user]);

  // Function to notify a liked profile
  const notifyProfileLiked = useCallback(async (likedProfile: DiscoveryProfile) => {
    try {
      if (!user) return;
      
      console.log(`${user.email} liked ${likedProfile.name}'s profile`);
      
      // Record the like in the database
      const success = await recordInteraction(likedProfile.id, 'pending');
      
      if (success) {
        toast.success(`Notification sent to ${likedProfile.name}`);
      }
    } catch (error) {
      console.error("Error sending like notification:", error);
    }
  }, [user, recordInteraction]);

  const handleSwipe = useCallback((dir: 'left' | 'right') => {
    setDirection(dir);
    
    if (currentProfile) {
      if (dir === 'right') {
        // Swiping right (like)
        if (!isPremium) {
          setRemainingLikes(prev => Math.max(0, prev - 1));
        }
        
        // Notify the profile that was liked
        notifyProfileLiked(currentProfile);
      } else {
        // Swiping left (dislike)
        recordInteraction(currentProfile.id, 'disliked');
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
  }, [currentProfileIndex, filteredProfiles.length, isPremium, currentProfile, notifyProfileLiked, recordInteraction]);

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
    hasProfiles,
    isLoading
  };
}
