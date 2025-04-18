
import { useState, useEffect } from 'react';
import { getLike } from '@/utils/api-service';

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

export const useLikedProfiles = (userId: string) => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLikedProfiles = async () => {
      try {
        setIsLoading(true);
        const result = await getLike(userId, "");
        setProfiles(result);
      } catch (err) {
        console.error('Error fetching liked profiles:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikedProfiles();
  }, [userId]);

  return {
    profiles,
    isLoading
  };
};
