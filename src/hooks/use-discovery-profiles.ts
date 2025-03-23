
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
          .neq('id', user.id) // Don't include the current user
          .order('created_at', { ascending: false });
        
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
        
        // Convert database profiles to DiscoveryProfile format
        const discoveryProfiles: DiscoveryProfile[] = profilesData.map(profile => {
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

  // Function to notify a liked profile
  const notifyProfileLiked = useCallback(async (likedProfile: DiscoveryProfile) => {
    try {
      if (!user) return;
      
      console.log(`${user.email} liked ${likedProfile.name}'s profile`);
      
      // Ensure the ID is a valid UUID before storing in the database
      if (!likedProfile.id || typeof likedProfile.id !== 'string' || 
          !likedProfile.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        console.error("Invalid profile ID format. Expected UUID format.");
        toast.error("Could not save like - profile ID format is invalid");
        return;
      }
      
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
    hasProfiles,
    isLoading
  };
}
