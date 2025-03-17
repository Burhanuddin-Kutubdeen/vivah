
import { MatchFilters } from './types.ts';

// Build the query to find matching profiles based on filters
export function buildMatchingQuery(supabase: any, currentUserProfile: any, filters: MatchFilters) {
  // Get opposite gender for heterosexual matching
  const oppositeGender = currentUserProfile.gender === 'male' ? 'female' : 'male';
  
  let query = supabase
    .from('profiles')
    .select(`
      id, 
      first_name, 
      last_name, 
      date_of_birth, 
      gender, 
      civil_status, 
      religion, 
      location, 
      bio, 
      interests, 
      avatar_url, 
      height, 
      weight
    `)
    .eq('gender', oppositeGender)
    .neq('id', currentUserProfile.id) // Don't include the current user
    .not('interests', 'is', null) // Must have interests
    .not('avatar_url', 'is', null); // Must have a profile picture
    
  // Apply filters if they exist
  if (filters.minAge || filters.maxAge) {
    // Calculate date ranges based on age filters
    const calculateDateFromAge = (age: number) => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - age);
      return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    };
    
    if (filters.minAge) {
      const maxDate = calculateDateFromAge(filters.minAge);
      query = query.lte('date_of_birth', maxDate);
    }
    
    if (filters.maxAge) {
      const minDate = calculateDateFromAge(filters.maxAge);
      query = query.gte('date_of_birth', minDate);
    }
  }
  
  if (filters.location) {
    query = query.ilike('location', `%${filters.location}%`);
  }
  
  if (filters.religion) {
    query = query.eq('religion', filters.religion);
  }
  
  return query;
}
