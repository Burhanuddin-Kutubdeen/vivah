
import React, { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from '@/contexts/AuthContext';
import CuratedMatchesHeader from './matches/CuratedMatchesHeader';
import MatchList from './matches/MatchList';
import { api } from '@/services/api';
import { toast } from 'sonner';
import { calculateAge } from '@/utils/profile-utils';
import { getUserGender } from '@/utils/user-utils';

interface CuratedMatchesGridProps {
  isOffline: boolean;
  isLoading?: boolean;
}

const CuratedMatchesGrid: React.FC<CuratedMatchesGridProps> = ({ isOffline, isLoading: parentLoading = false }) => {
  const { user } = useAuth();
  const [recommendedMatches, setRecommendedMatches] = useState([]);
  const [lastRefreshDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchRecommendedMatches = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Use the new API service to fetch matches
        const data = await api.profiles.getMatches({
          limit: 6
        });
        
        if (!data || data.length === 0) {
          console.log('No recommended profiles found');
          setRecommendedMatches([]);
          return;
        }
        
        // Convert profiles to match format
        const matches = data.map(profile => {
          const age = profile.date_of_birth ? calculateAge(profile.date_of_birth) : 25;
          
          return {
            id: profile.id,
            name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous',
            age,
            occupation: profile.job || 'Not specified',
            imageUrl: profile.avatar_url || '/placeholder.svg',
            matchPercentage: Math.floor(Math.random() * 30) + 70,
            isNewMatch: false,
            interests: profile.interests || []
          };
        });
        
        const sortedMatches = matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
        
        console.log(`Fetched ${sortedMatches.length} recommended matches from API`);
        setRecommendedMatches(sortedMatches);
      } catch (error) {
        console.error('Error fetching recommended matches:', error);
        toast.error('Failed to load recommended profiles');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecommendedMatches();
  }, [user]);

  const loading = parentLoading || isLoading;

  if (loading) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-32" />
        </div>
        
        <Skeleton className="h-5 w-64 mb-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-72 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <CuratedMatchesHeader 
        lastRefreshDate={lastRefreshDate}
        isOffline={isOffline}
      />
      {recommendedMatches.length > 0 ? (
        <MatchList matches={recommendedMatches} />
      ) : (
        <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-matrimony-600 dark:text-matrimony-300">
            No curated matches found. We'll find better matches as more users join the platform.
          </p>
        </div>
      )}
    </div>
  );
};

export default CuratedMatchesGrid;
