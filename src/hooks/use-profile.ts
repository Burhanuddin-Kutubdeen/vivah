
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useProfile = () => {
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [profileCheckError, setProfileCheckError] = useState<string | null>(null);

  // Check if user is at least 18 years old
  const isAtLeast18 = (dateOfBirth: Date): boolean => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 18;
  };

  // Function to check if the user's profile is complete
  const checkProfileCompletion = async (userId: string): Promise<boolean> => {
    setProfileCheckError(null);
    
    try {
      if (!userId) {
        console.error('Cannot check profile: No user ID provided');
        setIsProfileComplete(false);
        return false;
      }
      
      console.log(`Checking profile completion for user: ${userId}`);
      
      // Attempt to fetch profile data
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('date_of_birth, gender, interests, civil_status, avatar_url, bio, location')
          .eq('id', userId)
          .maybeSingle();
        
        if (error) {
          console.error('Error checking profile:', error);
          // Default to incomplete on error
          setIsProfileComplete(false);
          setProfileCheckError(error.message);
          return false;
        }
        
        if (!data) {
          console.log('No profile data found for user');
          setIsProfileComplete(false);
          return false;
        }
        
        // Check if required fields are filled
        const isComplete = !!(
          data.date_of_birth && 
          data.gender && 
          data.interests?.length > 0 && 
          data.civil_status && 
          data.avatar_url &&
          data.bio &&
          data.location
        );
        
        console.log('Profile completion check:', { isComplete, data });
        setIsProfileComplete(isComplete);
        return isComplete;
      } catch (fetchError) {
        console.error('Network error in profile check:', fetchError);
        // If there's a network error, fallback to local state
        console.log('Falling back to cached profile completion state:', isProfileComplete);
        setProfileCheckError('Network error, using cached state');
        return isProfileComplete;
      }
    } catch (error) {
      console.error('Error in profile check:', error);
      // Default to incomplete on error but preserve previous state
      setProfileCheckError('Unknown error in profile check');
      return isProfileComplete;
    }
  };

  return {
    isProfileComplete,
    setIsProfileComplete,
    checkProfileCompletion,
    isAtLeast18,
    profileCheckError
  };
};
