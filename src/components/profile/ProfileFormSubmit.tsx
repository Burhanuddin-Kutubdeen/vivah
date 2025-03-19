
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileFormValues } from './ProfileFormSchema';
import SubmitButton from './fields/SubmitButton';

interface ProfileFormSubmitProps {
  avatarUrl: string | null;
  values: ProfileFormValues;
  isEdit: boolean;
}

const ProfileFormSubmit: React.FC<ProfileFormSubmitProps> = ({ 
  avatarUrl, 
  values, 
  isEdit
}) => {
  const { user, setIsProfileComplete, checkProfileCompletion } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = async () => {
    try {
      // Validate user is logged in
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to complete your profile",
          variant: "destructive",
        });
        return;
      }
      
      // Validate avatar is uploaded
      if (!avatarUrl) {
        toast({
          title: "Photo required",
          description: "Please upload a profile photo to continue",
          variant: "destructive",
        });
        return;
      }
      
      setIsSubmitting(true);
      console.log("Submitting profile with values:", values);
      
      // Check if we're offline
      if (!navigator.onLine) {
        toast({
          title: "You're offline",
          description: "Your profile will be saved when you're back online.",
          variant: "destructive",
        });
        
        // Store form data temporarily 
        localStorage.setItem('pendingProfileData', JSON.stringify({
          ...values,
          dateOfBirth: values.dateOfBirth.toISOString(), // Convert Date to string for storage
          avatarUrl
        }));
        
        // Still allow navigation as if it succeeded
        setTimeout(() => {
          setIsProfileComplete(true);
          if (isEdit) {
            navigate('/profile', { replace: true });
          } else {
            navigate('/discover', { replace: true });
          }
        }, 800);
        
        return;
      }
      
      // Add request timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({
          date_of_birth: values.dateOfBirth.toISOString().split('T')[0],
          gender: values.gender,
          civil_status: values.civil_status,
          religion: values.religion || null,
          location: values.location,
          bio: values.bio,
          interests: values.interests,
          height: values.height ? parseFloat(values.height) : null,
          weight: values.weight ? parseFloat(values.weight) : null,
          avatar_url: avatarUrl,
          education: values.education || null,
          job: values.job || null,
          exercise: values.exercise || null,
          drinking: values.drinking || null,
          smoking: values.smoking || null,
          wants_kids: values.wants_kids || null,
          has_kids: values.has_kids || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      clearTimeout(timeoutId);
      
      if (error) {
        console.error("Profile update error:", error);
        throw error;
      }
      
      console.log("Profile updated successfully");
      
      // Remove any pending profile data
      localStorage.removeItem('pendingProfileData');
      
      // Show success message
      toast({
        title: "Profile updated",
        description: isEdit ? "Your profile has been updated successfully" : "Your profile has been completed successfully",
      });
      
      setSaveSuccess(true);
      
      // Force check profile completion
      try {
        await checkProfileCompletion(user.id);
        setIsProfileComplete(true);
        
        // Navigate based on whether this is an edit or new profile
        setTimeout(() => {
          if (isEdit) {
            navigate('/profile', { replace: true });
          } else {
            navigate('/discover', { replace: true });
          }
        }, 800);
      } catch (checkError) {
        console.error("Error checking profile completion:", checkError);
        // Still navigate even if check fails
        setIsProfileComplete(true);
        setTimeout(() => {
          if (isEdit) {
            navigate('/profile', { replace: true });
          } else {
            navigate('/discover', { replace: true });
          }
        }, 800);
      }
    } catch (error: any) {
      console.error("Profile update error:", error);
      setSaveSuccess(false);
      
      // Special handling for timeout errors
      if (error.name === 'AbortError' || error.message?.includes('aborted')) {
        toast({
          title: "Connection timed out",
          description: "The server is taking too long to respond. Please try again later.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Update failed",
          description: error.message || "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SubmitButton 
      isSubmitting={isSubmitting} 
      disabled={saveSuccess}
      text={saveSuccess ? "Profile Saved!" : isEdit ? "Update Profile" : "Complete Profile"}
    />
  );
};

export default ProfileFormSubmit;
