
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Match, MatchFilters } from './types';
import { fetchMutualMatches } from './match-service';
import { applyFiltersToMatches, sortMatchesByPriority } from './match-utils';

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

  // Function to load matches with optional filters
  const loadMatches = useCallback(async (customFilters?: MatchFilters) => {
    if (!user) {
      setError('You must be logged in to view matches');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { matches: fetchedMatches, error: fetchError } = await fetchMutualMatches(user.id);
      
      if (fetchError) {
        setError(fetchError);
        toast({
          title: 'Error',
          description: fetchError,
          variant: 'destructive',
        });
        return;
      }
      
      // Apply filters to the fetched matches
      const filtersToUse = customFilters || filters;
      let filteredMatches = applyFiltersToMatches(fetchedMatches, filtersToUse);
      
      // Sort matches based on priority
      const priority = filtersToUse.priority || 'interests';
      filteredMatches = sortMatchesByPriority(filteredMatches, priority);

      // Update matches
      setMatches(filteredMatches);
      
      // Update curated matches - top 4 matches
      if (filteredMatches.length > 0) {
        setCuratedMatches(filteredMatches.slice(0, 4));
        setLastRefreshDate(new Date());
      }
    } catch (err) {
      console.error('Unexpected error in loadMatches:', err);
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
    
    loadMatches({
      ...filters,
      ...newFilters
    });
  }, [filters, loadMatches]);

  // Fetch matches on component mount and when filters change
  useEffect(() => {
    if (user) {
      loadMatches();
    }
  }, [user, loadMatches]);

  return {
    matches,
    curatedMatches,
    isLoading,
    error,
    lastRefreshDate,
    filters,
    applyFilters,
    refreshMatches: () => loadMatches()
  };
};
