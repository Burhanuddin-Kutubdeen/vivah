
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useProfile = () => {
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  // Function to check if the user's profile is complete
  const checkProfileCompletion = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('date_of_birth, gender, interests, civil_status, avatar_url')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error checking profile:', error);
        setIsProfileComplete(false);
        return;
      }
      
      // Check if required fields are filled
      const isComplete = !!(
        data.date_of_birth && 
        data.gender && 
        data.interests?.length > 0 && 
        data.civil_status && 
        data.avatar_url
      );
      
      setIsProfileComplete(isComplete);
    } catch (error) {
      console.error('Error in profile check:', error);
      setIsProfileComplete(false);
    }
  };

  return {
    isProfileComplete,
    setIsProfileComplete,
    checkProfileCompletion
  };
};
