
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useProfile = () => {
  const [isProfileComplete, setIsProfileComplete] = useState(false);

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
  const checkProfileCompletion = async (userId: string) => {
    try {
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const { data, error } = await supabase
        .from('profiles')
        .select('date_of_birth, gender, interests, civil_status, avatar_url')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error checking profile:', error);
        // Default to incomplete on error
        setIsProfileComplete(false);
        return false;
      }
      
      // Check if required fields are filled
      const isComplete = !!(
        data.date_of_birth && 
        data.gender && 
        data.interests?.length > 0 && 
        data.civil_status && 
        data.avatar_url
      );
      
      console.log('Profile completion check:', { isComplete, data });
      setIsProfileComplete(isComplete);
      return isComplete;
    } catch (error) {
      console.error('Error in profile check:', error);
      // Default to incomplete on error
      setIsProfileComplete(false);
      return false;
    }
  };

  return {
    isProfileComplete,
    setIsProfileComplete,
    checkProfileCompletion,
    isAtLeast18
  };
};
