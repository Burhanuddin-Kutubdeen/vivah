
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
      if (!profileId) {
        setError('Missing profile ID');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // For numeric IDs, we're in demo/sample mode
        // Use a fallback profile instead of querying the database
        if (/^\d+$/.test(profileId)) {
          console.log("Using sample profile for numeric ID:", profileId);
          
          // Create sample profile data
          const sampleProfile: ProfileData = {
            id: profileId,
            first_name: "Sample",
            last_name: "Profile",
            date_of_birth: "1990-01-01",
            gender: "Female",
            civil_status: "Single",
            religion: "Spiritual",
            location: "New York, USA",
            bio: "This is a sample profile for demonstration purposes.",
            interests: ["Reading", "Travel", "Cooking"],
            avatar_url: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=1470&auto=format&fit=crop",
            height: 165,
            weight: 60,
            education: "Bachelor's Degree",
            job: "Software Developer",
            exercise: "Regular",
            drinking: "Social",
            smoking: "Never",
            wants_kids: "Maybe",
            has_kids: "No"
          };
          
          setProfile(sampleProfile);
          setIsLoading(false);
          return;
        }

        // For UUID format, query the database
        if (isValidUUID(profileId)) {
          const { data, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', profileId)
            .maybeSingle();

          if (fetchError) throw fetchError;

          if (data) {
            setProfile(data as ProfileData);
          } else {
            setError('Profile not found');
          }
        } else {
          setError('Invalid profile ID format');
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
