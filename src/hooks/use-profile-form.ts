
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { profileFormSchema, ProfileFormValues } from '@/components/profile/ProfileFormSchema';

export const useProfileForm = (userId: string | undefined, connectionError: boolean) => {
  const { toast } = useToast();
  const [loadError, setLoadError] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      location: "",
      bio: "",
      interests: [],
      height: "",
      weight: "",
      gender: "male",
      education: "",
      job: "",
      exercise: "",
      drinking: "",
      smoking: "",
      wants_kids: "",
      has_kids: ""
    },
  });

  // Load existing profile data with improved error handling
  useEffect(() => {
    const loadProfileData = async () => {
      if (!userId) return;
      
      try {
        setLoadError(false);
        
        // Add timeout for the request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, date_of_birth, gender, civil_status, religion, location, bio, interests, height, weight, education, job, exercise, drinking, smoking, wants_kids, has_kids')
          .eq('id', userId)
          .maybeSingle();
          
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
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            dateOfBirth: data.date_of_birth ? new Date(data.date_of_birth) : undefined,
            gender: data.gender as "male" | "female" || "male",
            civil_status: data.civil_status || "",
            religion: data.religion || "",
            location: data.location || "",
            bio: data.bio || "",
            interests: data.interests || [],
            height: data.height ? String(data.height) : "",
            weight: data.weight ? String(data.weight) : "",
            education: data.education || "",
            job: data.job || "",
            exercise: data.exercise || "",
            drinking: data.drinking || "",
            smoking: data.smoking || "",
            wants_kids: data.wants_kids || "",
            has_kids: data.has_kids || ""
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
  }, [userId, form, toast, connectionError]);

  return {
    form,
    loadError,
    submitAttempted,
    setSubmitAttempted
  };
};
