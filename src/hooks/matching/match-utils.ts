
import { supabase } from "@/integrations/supabase/client";
import { calculateAge } from '@/utils/profile-utils';
import { Match, MatchProfile, MatchDetails, MatchFilters } from './types';

// Function to apply filters to matches
export const applyFiltersToMatches = (
  matches: Match[],
  filters: MatchFilters
): Match[] => {
  let filteredMatches = [...matches];
  
  if (filters.minAge || filters.maxAge) {
    filteredMatches = filteredMatches.filter(match => {
      const age = match.profile.age;
      if (filters.minAge && age < filters.minAge) return false;
      if (filters.maxAge && age > filters.maxAge) return false;
      return true;
    });
  }
  
  if (filters.religion) {
    filteredMatches = filteredMatches.filter(match => 
      match.profile.religion === filters.religion
    );
  }
  
  if (filters.civilStatus) {
    filteredMatches = filteredMatches.filter(match => 
      match.profile.civilStatus === filters.civilStatus
    );
  }
  
  if (filters.location) {
    filteredMatches = filteredMatches.filter(match => 
      match.profile.location?.toLowerCase().includes(filters.location!.toLowerCase())
    );
  }
  
  return filteredMatches;
};

// Function to sort matches based on priority
export const sortMatchesByPriority = (
  matches: Match[],
  priority: MatchFilters['priority'] = 'interests'
): Match[] => {
  const sortedMatches = [...matches];
  
  sortedMatches.sort((a, b) => {
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
  
  return sortedMatches;
};

// Convert database profiles to Match objects
export const convertProfilesToMatches = (
  profiles: any[],
  userInterests: string[]
): Match[] => {
  return profiles.map(profile => {
    // Calculate shared interests
    const profileInterests = profile.interests || [];
    const sharedInterests = userInterests.length > 0 ? 
      profileInterests.filter((interest: string) => userInterests.includes(interest)) : [];
    
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
};
