
import { useState, useEffect } from 'react';
import { api } from '@/services/api';

export interface ProfileData {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  bio?: string;
  age?: number;
  location?: string;
  interests?: string[];
  [key: string]: any;
}

export const useProfileData = (profileId: string) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileId) return;
      
      try {
        const data = await api.profiles.get(profileId);
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [profileId]);

  return {
    profile,
    isLoading,
    error
  };
};
