
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';

export const useProfile = (profileId?: string) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [profileCheckError, setProfileCheckError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      const id = profileId || user?.id;
      if (!id) return;
      
      try {
        const data = await api.profiles.get(id);
        setProfile(data);
        
        // Check if profile is complete
        if (data) {
          const requiredFields = ['first_name', 'last_name', 'date_of_birth', 'gender', 'location'];
          const isComplete = requiredFields.every(field => data[field]);
          setIsProfileComplete(isComplete);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
        setProfileCheckError('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [profileId, user]);

  const checkProfileCompletion = async (userId: string) => {
    try {
      const data = await api.profiles.get(userId);
      if (data) {
        const requiredFields = ['first_name', 'last_name', 'date_of_birth', 'gender', 'location'];
        const isComplete = requiredFields.every(field => data[field]);
        setIsProfileComplete(isComplete);
        return isComplete;
      }
      return false;
    } catch (error) {
      console.error('Error checking profile completion:', error);
      setProfileCheckError('Failed to check profile completion');
      return false;
    }
  };

  const isAtLeast18 = (profile: any) => {
    if (!profile?.date_of_birth) return false;
    const birthDate = new Date(profile.date_of_birth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  };

  return {
    profile,
    isLoading,
    error,
    checkProfileCompletion,
    setIsProfileComplete,
    profileCheckError,
    isAtLeast18
  };
};
