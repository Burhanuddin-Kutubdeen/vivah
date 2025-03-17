
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MatchFilters {
  minAge?: number;
  maxAge?: number;
  location?: string;
  religion?: string;
  priority?: 'interests' | 'age' | 'location' | 'religion';
}

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  civil_status: string;
  religion: string;
  location: string;
  bio: string;
  interests: string[];
  avatar_url: string;
  height: number;
  weight: number;
}

interface MatchProfileResponse {
  profile: {
    id: string;
    name: string;
    age: number;
    occupation: string;
    location: string;
    imageUrl: string;
    bio: string;
    religion: string;
    civilStatus: string;
    interests: string[];
    height: number;
    weight: number;
  };
  matchDetails: {
    score: number;
    sharedInterests: string[];
    isNewMatch: boolean;
  };
}

// Calculate age from date of birth
function calculateAge(dob: string, today: Date): number {
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

// Build the query to find matching profiles based on filters
function buildMatchingQuery(supabase: any, currentUserProfile: any, filters: MatchFilters) {
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

// Calculate various score components for a match
function calculateScoreComponents(
  profile: Profile, 
  currentUserProfile: any, 
  today: Date
) {
  const profileInterests = profile.interests || [];
  const currentUserInterests = currentUserProfile.interests || [];
  
  // Calculate shared interests
  const sharedInterests = currentUserInterests.filter(interest => 
    profileInterests.includes(interest)
  );
  
  // Calculate interest score - percentage of shared interests
  const interestScore = currentUserInterests.length > 0 
    ? (sharedInterests.length / Math.max(currentUserInterests.length, profileInterests.length)) * 100
    : 0;
  
  // Calculate location score - 100 if same location, less otherwise
  const locationScore = profile.location && currentUserProfile.location && 
    profile.location.toLowerCase().includes(currentUserProfile.location.toLowerCase()) ? 100 : 50;
  
  // Calculate religion score - 100 if same religion, less otherwise
  const religionScore = profile.religion === currentUserProfile.religion ? 100 : 50;
  
  // Calculate age score (closer to user's age = higher score)
  const userAge = currentUserProfile.date_of_birth ? calculateAge(currentUserProfile.date_of_birth, today) : 30;
  const profileAge = calculateAge(profile.date_of_birth, today);
  const ageDifference = Math.abs(userAge - profileAge);
  const ageScore = Math.max(0, 100 - (ageDifference * 5)); // Reduce 5 points per year difference
  
  return {
    interestScore,
    locationScore,
    religionScore,
    ageScore,
    sharedInterests,
    profileAge
  };
}

// Calculate final score based on priority
function calculateFinalScore(
  scoreComponents: any, 
  priority: MatchFilters['priority'] = 'interests'
) {
  const { interestScore, locationScore, religionScore, ageScore } = scoreComponents;
  
  switch (priority) {
    case 'age':
      return ageScore * 0.4 + interestScore * 0.3 + locationScore * 0.15 + religionScore * 0.15;
    case 'location':
      return locationScore * 0.4 + interestScore * 0.3 + ageScore * 0.15 + religionScore * 0.15;
    case 'religion':
      return religionScore * 0.4 + interestScore * 0.3 + ageScore * 0.15 + locationScore * 0.15;
    case 'interests':
    default:
      return interestScore * 0.4 + ageScore * 0.3 + locationScore * 0.15 + religionScore * 0.15;
  }
}

// Format profile data for the response
function formatProfileResponse(
  profile: Profile, 
  scoreComponents: any, 
  finalScore: number
): MatchProfileResponse {
  return {
    profile: {
      id: profile.id,
      name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
      age: scoreComponents.profileAge,
      occupation: "Not specified", // This could be added to profiles table later
      location: profile.location,
      imageUrl: profile.avatar_url,
      bio: profile.bio,
      religion: profile.religion,
      civilStatus: profile.civil_status,
      interests: profile.interests,
      height: profile.height,
      weight: profile.weight,
    },
    matchDetails: {
      score: Math.round(finalScore),
      sharedInterests: scoreComponents.sharedInterests,
      isNewMatch: false, // This would be determined by actual usage data
    }
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request details
    const url = new URL(req.url);
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Get the user's JWT token from the request headers
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    // Extract filters from query parameters or request body
    let filters: MatchFilters = {};
    if (req.method === 'POST') {
      const requestData = await req.json();
      filters = requestData.filters || {};
    } else {
      filters.minAge = url.searchParams.get('minAge') ? parseInt(url.searchParams.get('minAge') as string) : undefined;
      filters.maxAge = url.searchParams.get('maxAge') ? parseInt(url.searchParams.get('maxAge') as string) : undefined;
      filters.location = url.searchParams.get('location') || undefined;
      filters.religion = url.searchParams.get('religion') || undefined;
      filters.priority = url.searchParams.get('priority') as MatchFilters['priority'] || 'interests';
    }
    
    // Get the user's profile
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.split(' ')[1]);
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    // Get the user's profile details
    const { data: currentUserProfile, error: profileError } = await supabase
      .from('profiles')
      .select('gender, interests, religion, location, date_of_birth')
      .eq('id', user.id)
      .single();
    
    if (profileError || !currentUserProfile) {
      console.error('Profile error:', profileError);
      return new Response(
        JSON.stringify({ error: 'Could not retrieve user profile' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }
    
    // Get today's date for age calculations
    const today = new Date();
    
    // Build query based on filters and heterosexual matching
    const query = buildMatchingQuery(supabase, {...currentUserProfile, id: user.id}, filters);
    
    // Execute the query
    const { data: potentialMatches, error: matchesError } = await query;
    
    if (matchesError) {
      console.error('Matches error:', matchesError);
      return new Response(
        JSON.stringify({ error: 'Failed to retrieve matches' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    // Process and score each potential match
    const scoredMatches = potentialMatches.map((profile: Profile) => {
      // Calculate all score components
      const scoreComponents = calculateScoreComponents(profile, currentUserProfile, today);
      
      // Calculate the final score based on priority
      const finalScore = calculateFinalScore(scoreComponents, filters.priority);
      
      // Return the formatted profile with score
      return formatProfileResponse(profile, scoreComponents, finalScore);
    });
    
    // Sort by score (highest first)
    scoredMatches.sort((a, b) => b.matchDetails.score - a.matchDetails.score);
    
    // Return the matches
    return new Response(
      JSON.stringify({
        matches: scoredMatches,
        totalCount: scoredMatches.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
