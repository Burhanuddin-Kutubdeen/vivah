
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

import { buildMatchingQuery } from './utils/query-builder.ts';
import { calculateScoreComponents, calculateFinalScore } from './utils/score-calculator.ts';
import { formatProfileResponse } from './utils/response-formatter.ts';
import { MatchFilters, Profile } from './utils/types.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
