
import { api } from "@/services/api";
import { convertProfilesToMatches } from './match-utils';
import { Match, MatchFilters } from './types';

export const fetchMutualMatches = async (
  userId: string,
  customFilters?: MatchFilters
): Promise<{ matches: Match[], error: string | null }> => {
  try {
    // Get mutual matches from the API
    const data = await api.profiles.getMatches(customFilters);
    
    if (!data || data.length === 0) {
      return { matches: [], error: null };
    }

    // Get current user's profile for interests comparison
    let userInterests: string[] = [];
    try {
      const currentUserProfile = await api.profiles.get(userId);
      userInterests = currentUserProfile?.interests || [];
    } catch (error) {
      console.error('Error fetching current user profile:', error);
    }

    // Convert the profiles to Match objects
    const matches = convertProfilesToMatches(data, userInterests);
    
    return { matches, error: null };
  } catch (err) {
    console.error('Unexpected error fetching matches:', err);
    return { matches: [], error: 'An unexpected error occurred' };
  }
};
