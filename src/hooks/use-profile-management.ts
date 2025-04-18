
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createProfile, updateProfile } from '@/utils/api-service';
import { Profile } from '@/types/user';

export const useProfileManagement = () => {
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const { toast } = useToast();

  const saveProfile = useCallback(async (userId: string, profileData: Profile, navigate: (path: string) => void) => {
    try {
      let result;
      if (userId === "") {
        result = await createProfile(profileData);
      } else {
        result = await updateProfile(userId, profileData);
      }

      if (result) {
        toast({
          title: "Profile saved",
          description: "Your profile has been saved successfully.",
        });
        setIsProfileComplete(true);
        navigate('/discover');
      } else {
        toast({
          title: "Failed to save profile",
          description: "An error occurred while saving your profile.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Failed to save profile",
        description: "An error occurred while saving your profile.",
        variant: "destructive",
      });
    }
  }, [toast]);

  return {
    isProfileComplete,
    setIsProfileComplete: (value: boolean) => {
      setIsProfileComplete(value);
    },
    saveProfile,
  };
};
