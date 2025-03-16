
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/use-profile';

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
}

const ProfileForm: React.FC<ProfileFormProps> = ({ avatarUrl, translate }) => {
  const { user, setIsProfileComplete, checkProfileCompletion } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to complete your profile",
          variant: "destructive",
        });
        return;
      }
      
      if (!avatarUrl) {
        toast({
          title: "Photo required",
          description: "Please upload a profile photo to continue",
          variant: "destructive",
        });
        return;
      }
      
      setIsSubmitting(true);
      
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
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Update profile completion status and verify it was set correctly
      setIsProfileComplete(true);
      
      // Force check profile completion to make sure it's updated
      if (user.id) {
        await checkProfileCompletion(user.id);
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been completed successfully",
      });
      
      // Add a small delay before redirecting to ensure state is updated
      setTimeout(() => {
        // Navigate to discover page
        navigate('/discover', { replace: true });
      }, 500);
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
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

        {/* Submit Button */}
        <SubmitButton isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
};

export default ProfileForm;
