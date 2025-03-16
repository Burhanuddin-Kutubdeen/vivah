
import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/use-profile';
import { useNavigate } from 'react-router-dom';

export const useProfileManagement = () => {
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const profileCheckInProgress = useRef(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { 
    checkProfileCompletion: checkProfileStatus,
    setIsProfileComplete: setProfileIsComplete,
    profileCheckError
  } = useProfile();
  
  // Function to check profile completion that updates both states
  const checkProfileCompletion = useCallback(async (userId: string) => {
    if (profileCheckInProgress.current) {
      console.log("Profile check already in progress, using cached state");
      return isProfileComplete;
    }
    
    profileCheckInProgress.current = true;
    try {
      const isComplete = await checkProfileStatus(userId);
      setIsProfileComplete(isComplete);
      return isComplete;
    } catch (error) {
      console.error("Error in checkProfileCompletion:", error);
      // On error, maintain previous state
      return isProfileComplete;
    } finally {
      profileCheckInProgress.current = false;
    }
  }, [checkProfileStatus, isProfileComplete]);

  // Handle user change with debouncing to prevent excessive profile checks
  const handleUserChange = useCallback(async (userId: string | null) => {
    if (userId && !profileCheckInProgress.current) {
      profileCheckInProgress.current = true;
      try {
        const isComplete = await checkProfileStatus(userId);
        setIsProfileComplete(isComplete);
      } catch (error) {
        console.error("Error checking profile on user change:", error);
      } finally {
        profileCheckInProgress.current = false;
      }
    }
  }, [checkProfileStatus]);

  // Navigate to appropriate page based on profile status
  const navigateBasedOnProfile = useCallback(async (userId: string, forceCheck = false) => {
    let isComplete = isProfileComplete;
    
    if (forceCheck) {
      try {
        isComplete = await checkProfileCompletion(userId);
      } catch (error) {
        console.error("Error checking profile for navigation:", error);
      }
    }
    
    // Add a short delay to ensure state updates are processed
    setTimeout(() => {
      // Redirect to profile setup if profile is not complete, otherwise to discover page
      if (!isComplete) {
        navigate('/profile-setup', { replace: true });
      } else {
        navigate('/discover', { replace: true });
      }
    }, 300);
  }, [isProfileComplete, checkProfileCompletion, navigate]);

  return {
    isProfileComplete,
    setIsProfileComplete: (value: boolean) => {
      setIsProfileComplete(value);
      setProfileIsComplete(value);
    },
    checkProfileCompletion,
    handleUserChange,
    navigateBasedOnProfile,
    profileCheckError
  };
};
