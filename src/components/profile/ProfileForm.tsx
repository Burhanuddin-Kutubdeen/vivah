
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';

import { Form } from "@/components/ui/form";

// Import field components
import DateOfBirthField from './fields/DateOfBirthField';
import GenderField from './fields/GenderField';
import CivilStatusField from './fields/CivilStatusField';
import ReligionField from './fields/ReligionField';
import HeightSelector from './HeightSelector';
import WeightField from './fields/WeightField';
import LocationSearchInput from './LocationSearchInput';
import BioField from './fields/BioField';
import InterestSelector from './InterestSelector';
import SubmitButton from './fields/SubmitButton';

// Form schema validation
const formSchema = z.object({
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
  }).refine((date) => {
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 18;
  }, "You must be at least 18 years old"),
  gender: z.enum(["male", "female"], {
    required_error: "Gender is required",
  }),
  civil_status: z.string({
    required_error: "Civil status is required",
  }),
  religion: z.string().optional(),
  location: z.string().min(2, "Location must be at least 2 characters").max(100),
  bio: z.string().min(10, "Bio must be at least 10 characters").max(500),
  interests: z.array(z.string()).min(1, "At least one interest is required"),
  height: z.string().optional(),
  weight: z.string().optional(),
});

interface ProfileFormProps {
  avatarUrl: string | null;
  translate: (key: string) => string;
  connectionError?: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ avatarUrl, translate, connectionError = false }) => {
  const { user, setIsProfileComplete, checkProfileCompletion } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      bio: "",
      interests: [],
      height: "",
      weight: "",
      gender: "male"
    },
  });

  // Load existing profile data with improved error handling
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user?.id) return;
      
      try {
        setLoadError(false);
        
        // Add timeout for the request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('date_of_birth, gender, civil_status, religion, location, bio, interests, height, weight')
          .eq('id', user.id)
          .maybeSingle()
          .abortSignal(controller.signal);
          
        clearTimeout(timeoutId);
        
        if (error) {
          console.error("Error loading profile data:", error);
          setLoadError(true);
          
          // Only show toast if not already showing connection error
          if (!connectionError) {
            toast({
              title: "Error loading profile data",
              description: "Your previously saved data couldn't be loaded. You can still continue setting up your profile.",
              variant: "destructive",
            });
          }
          return;
        }
        
        if (data) {
          // Only set form values if we have data
          form.reset({
            dateOfBirth: data.date_of_birth ? new Date(data.date_of_birth) : undefined,
            gender: data.gender as "male" | "female" || "male",
            civil_status: data.civil_status || "",
            religion: data.religion || "",
            location: data.location || "",
            bio: data.bio || "",
            interests: data.interests || [],
            height: data.height ? String(data.height) : "",
            weight: data.weight ? String(data.weight) : ""
          });
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
        setLoadError(true);
        
        // Only show toast if not already showing connection error
        if (!connectionError) {
          toast({
            title: "Error loading profile data",
            description: "We couldn't connect to load your profile. You can still continue setting up your profile.",
            variant: "destructive",
          });
        }
      }
    };
    
    loadProfileData();
    
    // Retry loading when online status changes
    const handleOnline = () => {
      loadProfileData();
    };
    
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [user, form, toast, connectionError]);

  // Handle form submission with improved error handling
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
        setSubmitAttempted(true);
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
          navigate('/discover', { replace: true });
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
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .abortSignal(controller.signal);
      
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
        description: "Your profile has been completed successfully",
      });
      
      setSaveSuccess(true);
      
      // Force check profile completion
      try {
        await checkProfileCompletion(user.id);
        setIsProfileComplete(true);
        
        // Navigate to discover page with a delay to ensure state is updated
        setTimeout(() => {
          navigate('/discover', { replace: true });
        }, 800);
      } catch (checkError) {
        console.error("Error checking profile completion:", checkError);
        // Still navigate even if check fails
        setIsProfileComplete(true);
        setTimeout(() => {
          navigate('/discover', { replace: true });
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date of Birth */}
          <DateOfBirthField control={form.control} />

          {/* Gender */}
          <GenderField control={form.control} />

          {/* Civil Status */}
          <CivilStatusField control={form.control} />

          {/* Religion (Optional) */}
          <ReligionField control={form.control} />

          {/* Height */}
          <HeightSelector control={form.control} />

          {/* Weight */}
          <WeightField control={form.control} />
        </div>

        {/* Location */}
        <LocationSearchInput control={form.control} />

        {/* Bio */}
        <BioField control={form.control} />

        {/* Interests */}
        <InterestSelector control={form.control} translate={translate} />

        {/* Photo required warning */}
        {!avatarUrl && submitAttempted && (
          <p className="text-red-500 text-center font-medium">
            Please upload a profile photo before submitting
          </p>
        )}

        {/* Submit Button */}
        <SubmitButton 
          isSubmitting={isSubmitting} 
          disabled={saveSuccess}
          text={saveSuccess ? "Profile Saved!" : "Complete Profile"}
        />
      </form>
    </Form>
  );
};

export default ProfileForm;
