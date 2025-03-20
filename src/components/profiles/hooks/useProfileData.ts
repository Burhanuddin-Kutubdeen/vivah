
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { isValidUUID } from '@/utils/validation';

export interface ProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  gender: string | null;
  civil_status: string | null;
  religion: string | null;
  location: string | null;
  bio: string | null;
  interests: string[] | null;
  avatar_url: string | null;
  height: number | null;
  weight: number | null;
  education: string | null;
  job: string | null;
  exercise: string | null;
  drinking: string | null;
  smoking: string | null;
  wants_kids: string | null;
  has_kids: string | null;
}

export const useProfileData = (profileId: string) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!profileId || !isValidUUID(profileId)) {
        setError('Invalid profile ID');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileId)
          .single();

        if (fetchError) throw fetchError;

        if (data) {
          setProfile(data as ProfileData);
        } else {
          setError('Profile not found');
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [profileId]);

  return {
    profile,
    isLoading,
    error
  };
};
