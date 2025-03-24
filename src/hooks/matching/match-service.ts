
import { supabase } from "@/integrations/supabase/client";
import { convertProfilesToMatches } from './match-utils';
import { Match, MatchFilters } from './types';
import { useToast } from '@/hooks/use-toast';

// Fetch mutual matches from the database
export const fetchMutualMatches = async (
  userId: string,
  customFilters?: MatchFilters,
  toastFn?: typeof useToast
): Promise<{ matches: Match[], error: string | null }> => {
  try {
    // First get users who liked the current user
    const { data: likedByData, error: likedByError } = await supabase
      .from('likes')
      .select('user_id')
      .eq('liked_profile_id', userId)
      .eq('status', 'pending');

    if (likedByError) {
      console.error('Error fetching likes:', likedByError);
      return { matches: [], error: 'Failed to load matches' };
    }

    // If nobody liked the user, return empty matches
    if (!likedByData || likedByData.length === 0) {
      return { matches: [], error: null };
    }

    // Get the IDs of users who liked the current user
    const userIdsWhoLikedMe = likedByData.map(item => item.user_id);

    // Now get users whom the current user liked
    const { data: iLikedData, error: iLikedError } = await supabase
      .from('likes')
      .select('liked_profile_id')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .in('liked_profile_id', userIdsWhoLikedMe);  // Only get mutual likes

    if (iLikedError) {
      console.error('Error fetching my likes:', iLikedError);
      return { matches: [], error: 'Failed to load mutual matches' };
    }

    // If the user hasn't liked anyone back, return empty matches
    if (!iLikedData || iLikedData.length === 0) {
      return { matches: [], error: null };
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
      return { matches: [], error: 'Failed to load match profiles' };
    }

    // Get current user's profile for interests comparison
    const { data: currentUserProfile, error: currentUserProfileError } = await supabase
      .from('profiles')
      .select('interests')
      .eq('id', userId)
      .single();

    if (currentUserProfileError && currentUserProfileError.code !== 'PGRST116') {
      console.error('Error fetching current user profile:', currentUserProfileError);
    }

    const userInterests = currentUserProfile?.interests || [];

    // Convert the profiles to Match objects
    const matches = convertProfilesToMatches(profilesData, userInterests);
    
    return { matches, error: null };
  } catch (err) {
    console.error('Unexpected error fetching matches:', err);
    return { matches: [], error: 'An unexpected error occurred' };
  }
};
