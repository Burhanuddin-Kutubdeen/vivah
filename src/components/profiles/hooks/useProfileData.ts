
import { useState, useEffect } from 'react';
import { api } from '@/services/api';

export const useProfileData = (profileId: string) => {
  const [profile, setProfile] = useState(null);
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
