
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';

export const useDiscoveryProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!user) return;
      
      try {
        const data = await api.profiles.getMatches();
        setProfiles(data || []);
      } catch (err) {
        console.error('Error fetching discovery profiles:', err);
        setError('Failed to load profiles');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, [user]);

  return {
    profiles,
    isLoading,
    error
  };
};
