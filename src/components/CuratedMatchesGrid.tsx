
import React, { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from '@/contexts/AuthContext';
import CuratedMatchesHeader from './matches/CuratedMatchesHeader';
import MatchList from './matches/MatchList';
import { supabase } from '@/integrations/supabase/client';
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
        // Get current user's gender for opposite gender matching
        const userGender = getUserGender(user);
        const oppositeGender = userGender === 'male' ? 'female' : 'male';
        
        // Fetch profiles with the opposite gender
        const { data: profilesData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('gender', oppositeGender)
          .neq('id', user.id)
          .limit(6); // Fetch a limited number for curated matches
        
        if (error) {
          console.error('Error fetching recommended profiles:', error);
          toast.error('Failed to load recommended profiles');
          setRecommendedMatches([]);
          return;
        }
        
        if (!profilesData || profilesData.length === 0) {
          console.log('No recommended profiles found');
          setRecommendedMatches([]);
          return;
        }
        
        // Get user interests for sorting
        const userInterests = user?.user_metadata?.interests || 
                            user?.user_metadata?.profile?.interests || 
                            [];
        
        // Convert profiles to match format
        const matches = profilesData.map(profile => {
          // Calculate shared interests
          const profileInterests = profile.interests || [];
          const sharedInterests = userInterests.length > 0 ? 
            profileInterests.filter(interest => userInterests.includes(interest)) : [];
          
          // Calculate match percentage based on shared interests and other factors
          const matchPercentage = sharedInterests.length > 0 ? 
            Math.min(100, 60 + (sharedInterests.length * 10)) : // Base 60% + 10% per shared interest
            Math.floor(60 + Math.random() * 30); // Random percentage between 60-90 if no shared interests
          
          const age = profile.date_of_birth ? calculateAge(profile.date_of_birth) : 25;
          
          return {
            id: profile.id,
            name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous',
            age,
            occupation: profile.job || 'Not specified',
            imageUrl: profile.avatar_url || '/placeholder.svg',
            matchPercentage,
            isNewMatch: false, // Would need actual tracking
            interests: profile.interests || []
          };
        });
        
        // Sort by match percentage
        const sortedMatches = matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
        
        console.log(`Fetched ${sortedMatches.length} recommended matches from database`);
        setRecommendedMatches(sortedMatches);
      } catch (error) {
        console.error('Unexpected error fetching recommended matches:', error);
        toast.error('Something went wrong while loading recommended profiles');
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
