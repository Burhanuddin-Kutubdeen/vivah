
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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

  // Function to fetch matches from the edge function
  const fetchMatches = useCallback(async (customFilters?: MatchFilters) => {
    if (!user) {
      setError('You must be logged in to view matches');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const filtersToUse = customFilters || filters;
      const { data, error } = await supabase.functions.invoke('get-matches', {
        body: { filters: filtersToUse }
      });

      if (error) {
        console.error('Error fetching matches:', error);
        setError('Failed to load matches');
        toast({
          title: 'Error',
          description: 'Failed to load matches. Please try again later.',
          variant: 'destructive',
        });
        return;
      }

      if (data.error) {
        console.error('API error:', data.error);
        setError(data.error);
        toast({
          title: 'Error',
          description: data.error,
          variant: 'destructive',
        });
        return;
      }

      // Update matches
      setMatches(data.matches || []);
      
      // Update curated matches - top 4 matches
      if (data.matches && data.matches.length > 0) {
        setCuratedMatches(data.matches.slice(0, 4));
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
    
    fetchMatches({
      ...filters,
      ...newFilters
    });
  }, [filters, fetchMatches]);

  // Fetch matches on component mount and when filters change
  useEffect(() => {
    if (user) {
      fetchMatches();
    }
  }, [user, fetchMatches]);

  return {
    matches,
    curatedMatches,
    isLoading,
    error,
    lastRefreshDate,
    filters,
    applyFilters,
    refreshMatches: () => fetchMatches()
  };
};
