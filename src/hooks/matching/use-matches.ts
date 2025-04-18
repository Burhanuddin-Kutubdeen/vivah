
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Match, MatchFilters } from './types'; // Update the import path
import { applyFiltersToMatches, sortMatchesByPriority } from './match-utils';
import { getMatch } from '@/utils/api-service';

export const useMatches = (userId: string) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [curatedMatches, setCuratedMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshDate, setLastRefreshDate] = useState<Date>(new Date());
  const [filters, setFilters] = useState<MatchFilters>({
    priority: 'interests'
  });
  const { toast } = useToast();

  // Function to load matches with optional filters
  const loadMatches = useCallback(async (userId: string, customFilters?: MatchFilters) => {
    setIsLoading(true);

    try {
      const fetchedMatches = await getMatch(userId, "");

      if (!fetchedMatches) {
        toast({
          title: 'Error',
          description: "Error getting the matches",
          variant: 'destructive',
        });
      }

      if (!Array.isArray(fetchedMatches)) {
        throw new Error("Invalid matches data: Matches should be an array.");
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
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    } 
  }, [filters, toast]);

  // Apply filters and refresh matches
  const applyFilters = useCallback((newFilters: MatchFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
    
    loadMatches({
        ...filters,
        ...newFilters
      }, userId);
  }, [filters, loadMatches, userId]);

  return {
    matches,
    curatedMatches,
    isLoading,
    lastRefreshDate,
    filters,
    applyFilters,
    refreshMatches: () => loadMatches(userId)
  };
};
