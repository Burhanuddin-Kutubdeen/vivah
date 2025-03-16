
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';

export const useProfile = () => {
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [profileCheckError, setProfileCheckError] = useState<string | null>(null);
  const [lastSuccessfulCheck, setLastSuccessfulCheck] = useState<number | null>(null);
  const [checkCount, setCheckCount] = useState(0);
  const { toast } = useToast();

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

  const checkProfileCompletion = async (userId: string): Promise<boolean> => {
    setProfileCheckError(null);
    
    const now = Date.now();
    if (lastSuccessfulCheck && now - lastSuccessfulCheck < 5000) {
      console.log("Using cached profile completion status");
      return isProfileComplete;
    }
    
    setCheckCount(prev => prev + 1);
    if (checkCount > 5) {
      console.log("Maximum check attempts reached, using cached state");
      return isProfileComplete;
    }
    
    if (!navigator.onLine) {
      console.log("Device is offline, using cached profile status");
      return isProfileComplete;
    }
    
    try {
      if (!userId) {
        console.error('Cannot check profile: No user ID provided');
        setIsProfileComplete(false);
        return false;
      }
      
      console.log(`Checking profile completion for user: ${userId}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        throw new Error('Request timeout');
      }, 3000);
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('date_of_birth, gender, interests, civil_status, avatar_url, bio, location')
          .eq('id', userId)
          .maybeSingle();
        
        clearTimeout(timeoutId);
        
        if (error) {
          console.error('Error checking profile:', error);
          setProfileCheckError(error.message);
          
          if (!profileCheckError) {
            toast({
              title: "Connection issue",
              description: "There was a problem connecting to the server. Using cached profile state.",
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
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        
        if (fetchError.name === 'AbortError') {
          console.error('Profile check request timed out');
          if (!profileCheckError?.includes('timeout')) {
            toast({
              title: "Connection issue",
              description: "The server is taking too long to respond. Using cached profile data.",
              variant: "destructive",
            });
          }
        } else {
          console.error('Network error in profile check:', fetchError);
        }
        
        console.log('Falling back to cached profile completion state:', isProfileComplete);
        setProfileCheckError('Network error, using cached state');
        
        return isProfileComplete;
      }
    } catch (error: any) {
      console.error('Error in profile check:', error);
      
      setProfileCheckError('Unknown error in profile check');
      
      if (error.message === 'Request timeout') {
        console.log('Profile check timed out');
        if (!profileCheckError?.includes('timeout')) {
          toast({
            title: "Connection issue",
            description: "The server is taking too long to respond. Using cached profile data.",
            variant: "destructive",
          });
        }
      }
      
      return isProfileComplete;
    }
  };

  return {
    isProfileComplete,
    setIsProfileComplete,
    checkProfileCompletion,
    isAtLeast18,
    profileCheckError,
    checkCount
  };
};
