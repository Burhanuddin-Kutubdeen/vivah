
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { calculateAge } from '@/utils/profile-utils';

export interface MatchProfile {
  id: string;
  name: string;
  age: number;
  occupation: string;
  location: string;
  imageUrl: string;
  bio: string;
  religion?: string;
  civilStatus?: string;
  interests: string[];
  height?: number;
  weight?: number;
}

export interface MatchDetails {
  score: number;
  sharedInterests: string[];
  isNewMatch: boolean;
}

export interface Match {
  profile: MatchProfile;
  matchDetails: MatchDetails;
}

export interface MatchFilters {
  minAge?: number;
  maxAge?: number;
  location?: string;
  religion?: string;
  civilStatus?: string;
  priority?: 'interests' | 'age' | 'location' | 'religion';
}

export const useMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [curatedMatches, setCuratedMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshDate, setLastRefreshDate] = useState<Date>(new Date());
  const [filters, setFilters] = useState<MatchFilters>({
    priority: 'interests'
  });
  const { user } = useAuth();
  const { toast } = useToast();

  // Function to fetch mutual matches directly from the database
  const fetchMutualMatches = useCallback(async (customFilters?: MatchFilters) => {
    if (!user) {
      setError('You must be logged in to view matches');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First get users who liked the current user
      const { data: likedByData, error: likedByError } = await supabase
        .from('likes')
        .select('user_id')
        .eq('liked_profile_id', user.id)
        .eq('status', 'pending');

      if (likedByError) {
        console.error('Error fetching likes:', likedByError);
        setError('Failed to load matches');
        toast({
          title: 'Error',
          description: 'Failed to load users who liked you',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      // If nobody liked the user, return empty matches
      if (!likedByData || likedByData.length === 0) {
        setMatches([]);
        setCuratedMatches([]);
        setIsLoading(false);
        return;
      }

      // Get the IDs of users who liked the current user
      const userIdsWhoLikedMe = likedByData.map(item => item.user_id);

      // Now get users whom the current user liked
      const { data: iLikedData, error: iLikedError } = await supabase
        .from('likes')
        .select('liked_profile_id')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .in('liked_profile_id', userIdsWhoLikedMe);  // Only get mutual likes

      if (iLikedError) {
        console.error('Error fetching my likes:', iLikedError);
        setError('Failed to load mutual matches');
        toast({
          title: 'Error',
          description: 'Failed to load your likes',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      // If the user hasn't liked anyone back, return empty matches
      if (!iLikedData || iLikedData.length === 0) {
        setMatches([]);
        setCuratedMatches([]);
        setIsLoading(false);
        return;
      }

      // These are the mutual matches - users who liked me and I liked back
      const mutualMatchIds = iLikedData.map(item => item.liked_profile_id);
      
      console.log(`Found ${mutualMatchIds.length} mutual matches`);

      // Fetch the profiles of mutual matches
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', mutualMatchIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        setError('Failed to load match profiles');
        toast({
          title: 'Error',
          description: 'Failed to load match profiles',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      // Get current user's profile for interests comparison
      const { data: currentUserProfile, error: currentUserProfileError } = await supabase
        .from('profiles')
        .select('interests')
        .eq('id', user.id)
        .single();

      if (currentUserProfileError && currentUserProfileError.code !== 'PGRST116') {
        console.error('Error fetching current user profile:', currentUserProfileError);
      }

      const userInterests = currentUserProfile?.interests || [];

      // Convert the profiles to Match objects
      const matchObjs = profilesData.map(profile => {
        // Calculate shared interests
        const profileInterests = profile.interests || [];
        const sharedInterests = userInterests.length > 0 ? 
          profileInterests.filter(interest => userInterests.includes(interest)) : [];
        
        // Calculate match score based on shared interests
        const interestScore = Math.min(100, 60 + (sharedInterests.length * 10));
        
        // Get match profile age
        const age = profile.date_of_birth ? calculateAge(profile.date_of_birth) : 30;
        
        return {
          profile: {
            id: profile.id,
            name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous',
            age,
            occupation: profile.job || 'Not specified',
            location: profile.location || 'Not specified',
            bio: profile.bio || 'No bio available',
            imageUrl: profile.avatar_url || '/placeholder.svg',
            religion: profile.religion,
            civilStatus: profile.civil_status,
            interests: profile.interests || [],
            height: profile.height,
            weight: profile.weight
          },
          matchDetails: {
            score: interestScore,
            sharedInterests,
            isNewMatch: true // Consider all matches as new for now
          }
        };
      });

      // Apply filters if provided
      let filteredMatches = [...matchObjs];
      
      if (customFilters || filters) {
        const filtersToUse = customFilters || filters;
        
        if (filtersToUse.minAge || filtersToUse.maxAge) {
          filteredMatches = filteredMatches.filter(match => {
            const age = match.profile.age;
            if (filtersToUse.minAge && age < filtersToUse.minAge) return false;
            if (filtersToUse.maxAge && age > filtersToUse.maxAge) return false;
            return true;
          });
        }
        
        if (filtersToUse.religion) {
          filteredMatches = filteredMatches.filter(match => 
            match.profile.religion === filtersToUse.religion
          );
        }
        
        if (filtersToUse.civilStatus) {
          filteredMatches = filteredMatches.filter(match => 
            match.profile.civilStatus === filtersToUse.civilStatus
          );
        }
        
        if (filtersToUse.location) {
          filteredMatches = filteredMatches.filter(match => 
            match.profile.location?.toLowerCase().includes(filtersToUse.location!.toLowerCase())
          );
        }
      }
      
      // Sort matches based on priority
      const priority = (customFilters?.priority || filters.priority) ?? 'interests';
      
      filteredMatches.sort((a, b) => {
        if (priority === 'interests') {
          return b.matchDetails.sharedInterests.length - a.matchDetails.sharedInterests.length;
        } else if (priority === 'age') {
          // Sort by closest age to the user (assuming we have user age)
          return a.profile.age - b.profile.age;
        } else if (priority === 'location') {
          // For locations, we just maintain the order but prioritize matches with locations
          if (a.profile.location && !b.profile.location) return -1;
          if (!a.profile.location && b.profile.location) return 1;
          return 0;
        } else {
          // Default to match score
          return b.matchDetails.score - a.matchDetails.score;
        }
      });

      // Update matches
      setMatches(filteredMatches);
      
      // Update curated matches - top 4 matches
      if (filteredMatches.length > 0) {
        setCuratedMatches(filteredMatches.slice(0, 4));
        setLastRefreshDate(new Date());
      }
    } catch (err) {
      console.error('Unexpected error fetching matches:', err);
      setError('An unexpected error occurred');
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, filters, toast]);

  // Apply filters and refresh matches
  const applyFilters = useCallback((newFilters: MatchFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
    
    fetchMutualMatches({
      ...filters,
      ...newFilters
    });
  }, [filters, fetchMutualMatches]);

  // Fetch matches on component mount and when filters change
  useEffect(() => {
    if (user) {
      fetchMutualMatches();
    }
  }, [user, fetchMutualMatches]);

  return {
    matches,
    curatedMatches,
    isLoading,
    error,
    lastRefreshDate,
    filters,
    applyFilters,
    refreshMatches: () => fetchMutualMatches()
  };
};
