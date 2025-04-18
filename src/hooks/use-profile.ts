
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getProfile } from '@/utils/api-service';
import { Profile } from '@/types/user';

export const useProfile = () => {
  const { toast } = useToast();

  const getProfileData = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      const result = await getProfile(userId);
      if (result.message) {
        toast({
          title: "Get profile failed",
          description: result.message,
          variant: "destructive",
        });
        return null;
      } else {
        return result;
      }
    } catch (error) {
      toast({
        title: "Get profile failed",
        description: "An unknown error occurred",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  return {
    getProfileData,
  };
};
