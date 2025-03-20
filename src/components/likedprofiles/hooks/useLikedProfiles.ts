
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface LikedProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  avatar_url: string | null;
  religion: string | null;
  location: string | null;
  job: string | null;
  created_at: string;
  bio: string | null;
  interests: string[] | null;
}

interface FilterOptions {
  ageRange?: [number, number];
  religion?: string;
}

export const useLikedProfiles = (filters?: FilterOptions) => {
  const [profiles, setProfiles] = useState<LikedProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLikedProfiles = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Get IDs of users who liked the current user
        const { data: likesData, error: likesError } = await supabase
          .from('likes')
          .select('user_id, created_at')
          .eq('liked_profile_id', user.id)
          .eq('status', 'pending');

        if (likesError) throw likesError;

        if (!likesData || likesData.length === 0) {
          setProfiles([]);
          setIsLoading(false);
          return;
        }

        const likerIds = likesData.map(like => like.user_id);
        
        // Fetch profile data for the likers
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, date_of_birth, avatar_url, religion, location, job, created_at, bio, interests')
          .in('id', likerIds);

        if (profilesError) throw profilesError;

        if (profilesData) {
          // Combine profiles with created_at from likes
          const profilesWithLikeDate = profilesData.map(profile => {
            const likeInfo = likesData.find(like => like.user_id === profile.id);
            return {
              ...profile,
              liked_at: likeInfo?.created_at || new Date().toISOString()
            };
          });

          setProfiles(profilesWithLikeDate as LikedProfile[]);
        }
      } catch (err) {
        console.error('Error fetching liked profiles:', err);
        setError('Failed to load profiles who liked you');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikedProfiles();
  }, [user, filters?.ageRange, filters?.religion]);

  return {
    profiles,
    isLoading,
    error
  };
};
