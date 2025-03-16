
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';

export const useProfile = () => {
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [profileCheckError, setProfileCheckError] = useState<string | null>(null);
  const [lastSuccessfulCheck, setLastSuccessfulCheck] = useState<number | null>(null);
  const { toast } = useToast();

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
    
    // Prevent multiple checks in quick succession (debounce)
    const now = Date.now();
    if (lastSuccessfulCheck && now - lastSuccessfulCheck < 3000) {
      console.log("Using cached profile completion status");
      return isProfileComplete;
    }
    
    try {
      if (!userId) {
        console.error('Cannot check profile: No user ID provided');
        setIsProfileComplete(false);
        return false;
      }
      
      console.log(`Checking profile completion for user: ${userId}`);
      
      // Set a timeout to prevent the request from hanging indefinitely
      const timeoutPromise = new Promise<{data: null, error: Error}>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 5000);
      });
      
      // Attempt to fetch profile data with timeout
      try {
        const profilePromise = supabase
          .from('profiles')
          .select('date_of_birth, gender, interests, civil_status, avatar_url, bio, location')
          .eq('id', userId)
          .maybeSingle();
        
        const { data, error } = await Promise.race([profilePromise, timeoutPromise]);
        
        if (error) {
          console.error('Error checking profile:', error);
          // Default to incomplete on error but retain previous state if we had a successful check before
          setProfileCheckError(error.message);
          
          // Show toast only for the first error
          if (!profileCheckError) {
            toast({
              title: "Connection issue",
              description: "There was a problem connecting to the server. Please try again.",
              variant: "destructive",
            });
          }
          
          return isProfileComplete;
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
        setLastSuccessfulCheck(Date.now());
        return isComplete;
      } catch (fetchError) {
        console.error('Network error in profile check:', fetchError);
        // If there's a network error, fallback to local state
        console.log('Falling back to cached profile completion state:', isProfileComplete);
        setProfileCheckError('Network error, using cached state');
        
        // Show toast for network errors
        toast({
          title: "Connection issue",
          description: "There was a problem connecting to the server. Using cached data.",
          variant: "destructive",
        });
        
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
