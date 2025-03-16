
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/use-profile';
import { cn } from "@/lib/utils";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import HeightSelector from './HeightSelector';
import InterestSelector from './InterestSelector';
import LocationSearchInput from './LocationSearchInput';

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
  const { isAtLeast18 } = useProfile();
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
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of Birth (18+ only)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        // Disable future dates
                        if (date > new Date()) return true;
                        
                        // Disable dates for under 18
                        if (!isAtLeast18(date)) return true;
                        
                        // Disable very old dates (100+ years)
                        const hundredYearsAgo = new Date();
                        hundredYearsAgo.setFullYear(hundredYearsAgo.getFullYear() - 100);
                        return date < hundredYearsAgo;
                      }}
                      fromYear={new Date().getFullYear() - 100}
                      toYear={new Date().getFullYear() - 18}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  You must be at least 18 years old
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Gender */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <RadioGroup 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <label htmlFor="male" className="cursor-pointer">Male</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <label htmlFor="female" className="cursor-pointer">Female</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Civil Status */}
          <FormField
            control={form.control}
            name="civil_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Civil Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Religion (Optional) */}
          <FormField
            control={form.control}
            name="religion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Religion (Optional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select religion (optional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="hindu">Hindu</SelectItem>
                    <SelectItem value="christian">Christian</SelectItem>
                    <SelectItem value="muslim">Muslim</SelectItem>
                    <SelectItem value="buddhist">Buddhist</SelectItem>
                    <SelectItem value="sikh">Sikh</SelectItem>
                    <SelectItem value="jain">Jain</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Height */}
          <HeightSelector control={form.control} />

          {/* Weight */}
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (kg) (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your weight in kg"
                    type="number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Location */}
        <LocationSearchInput control={form.control} />

        {/* Bio */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About Yourself</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell potential matches about yourself, your interests, and what you're looking for..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Minimum 10 characters, maximum 500 characters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Interests */}
        <InterestSelector control={form.control} translate={translate} />

        <Button 
          type="submit" 
          className="w-full rounded-full bg-matrimony-600 hover:bg-matrimony-700 mt-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Complete Profile"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
