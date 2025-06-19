
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';

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

        // Get admirers from the API
        const admirersData = await api.likes.getAdmirers();

        if (!admirersData || admirersData.length === 0) {
          setProfiles([]);
          setIsLoading(false);
          return;
        }

        setProfiles(admirersData as LikedProfile[]);
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
