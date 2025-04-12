
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileFormValues } from './ProfileFormSchema';
import SubmitButton from './fields/SubmitButton';
import { updateProfile } from '@/utils/profile-service';

interface ProfileFormSubmitProps {
  avatarUrl: string | null;
  values: ProfileFormValues;
  isEdit: boolean;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const ProfileFormSubmit: React.FC<ProfileFormSubmitProps> = ({ 
  avatarUrl, 
  values, 
  isEdit,
  onSubmit,
  isSubmitting: formIsSubmitting
}) => {
  const { user, setIsProfileComplete, checkProfileCompletion } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [localIsSubmitting, setLocalIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Use either the form's isSubmitting state or our local state
  const isSubmitting = formIsSubmitting || localIsSubmitting;

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
      
      setLocalIsSubmitting(true);
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
      
      // Pass the form values directly to updateProfile, which will handle the conversion
      const profileData = {
        ...values,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };
      
      // Add request timeout handling
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timed out")), 8000);
      });
      
      // Race between the update request and the timeout
      const error = await Promise.race([
        updateProfile(profileData),
        timeoutPromise
      ]);
      
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
      if (error.name === 'AbortError' || error.message?.includes('aborted') || error.message?.includes('timed out')) {
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
      setLocalIsSubmitting(false);
      // Trigger the onSubmit callback for the parent form
      onSubmit();
    }
  };

  return (
    <SubmitButton 
      isSubmitting={isSubmitting} 
      disabled={saveSuccess}
      text={saveSuccess ? "Profile Saved!" : isEdit ? "Update Profile" : "Complete Profile"}
      onClick={handleSubmit}
    />
  );
};

export default ProfileFormSubmit;
