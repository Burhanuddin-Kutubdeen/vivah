
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/use-profile';
import AnimatedTransition from '@/components/AnimatedTransition';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage, 
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Upload, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

// Available languages
const languages = [
  { code: 'en', label: 'English' },
  { code: 'si', label: 'සිංහල' },
  { code: 'ta', label: 'தமிழ்' }
];

// Common interests for selection
const commonInterests = [
  "Travel", "Cooking", "Reading", "Movies", "Music", "Dancing", 
  "Photography", "Art", "Gaming", "Sports", "Fitness", "Yoga", 
  "Hiking", "Biking", "Swimming", "Fishing", "Gardening", "Meditation",
  "Writing", "Painting", "Fashion", "Technology", "Science", "History", 
  "Politics", "Nature", "Animals", "Food"
];

// Heights in feet and inches
const heightOptions = Array.from({ length: 37 }, (_, i) => {
  const feet = Math.floor((i + 48) / 12);
  const inches = (i + 48) % 12;
  const cm = Math.round((i + 48) * 2.54);
  return {
    value: cm.toString(),
    label: `${feet}'${inches}" (${cm} cm)`
  };
});

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

const ProfileSetup = () => {
  const { user, setIsProfileComplete } = useAuth();
  const { isAtLeast18 } = useProfile();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [locationSearchResults, setLocationSearchResults] = useState<string[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

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

  // Handle file upload for profile photo
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      setIsUploading(true);
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
        });
      
      if (error) {
        throw error;
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path);
      
      setAvatarUrl(urlData.publicUrl);
      
      toast({
        title: "Upload successful",
        description: "Your photo has been uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Mock location search function (would connect to a real API in production)
  const searchLocations = async (query: string) => {
    if (query.length < 2) {
      setLocationSearchResults([]);
      return;
    }
    
    setIsSearchingLocation(true);
    
    // Simulated API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock locations (in a real app, this would be an API call)
    const mockResults = [
      `${query}, Sri Lanka`,
      `${query} City, Sri Lanka`,
      `${query} Town, India`,
      `${query} Central, United Kingdom`,
      `${query} East, United States`
    ];
    
    setLocationSearchResults(mockResults);
    setIsSearchingLocation(false);
  };

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
      
      // Update profile completion status
      setIsProfileComplete(true);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been completed successfully",
      });
      
      // Navigate to discover page
      navigate('/discover');
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

  // Translation function (simplified for demonstration)
  const translate = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      'profile_setup_title': {
        'en': 'Complete Your Profile',
        'si': 'ඔබේ ප්‍රොෆයිල් සම්පූර්ණ කරන්න',
        'ta': 'உங்கள் சுயவிவரத்தை பூர்த்தி செய்யுங்கள்'
      },
      'profile_setup_subtitle': {
        'en': 'Tell us more about yourself to help find your perfect match',
        'si': 'ඔබේ පරිපූර්ණ ගැලපීම සොයා ගැනීමට උදව් කිරීමට ඔබ ගැන තවත් අපට කියන්න',
        'ta': 'உங்களின் சரியான பொருத்தத்தைக் கண்டுபிடிக்க உதவ உங்களைப் பற்றி மேலும் எங்களுக்குச் சொல்லுங்கள்'
      },
      // Add more translations as needed
    };
    
    return translations[key]?.[currentLanguage] || translations[key]?.['en'] || key;
  };

  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-gradient-to-b from-white to-matrimony-50 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        
        <div className="absolute top-4 right-4 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {languages.find(lang => lang.code === currentLanguage)?.label || 'Language'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map(lang => (
                <DropdownMenuItem 
                  key={lang.code}
                  onClick={() => setCurrentLanguage(lang.code)}
                  className={currentLanguage === lang.code ? "bg-matrimony-50 font-semibold" : ""}
                >
                  {lang.label}
                  {currentLanguage === lang.code && <Check className="ml-2 h-4 w-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <main className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-3xl">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-100 dark:border-gray-700">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">{translate('profile_setup_title')}</h1>
                <p className="text-matrimony-600 dark:text-matrimony-300">
                  {translate('profile_setup_subtitle')}
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Profile Photo</h2>
                <div className="flex flex-col items-center justify-center">
                  <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-4 relative">
                    {avatarUrl ? (
                      <img 
                        src={avatarUrl} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        {isUploading ? (
                          <Loader2 className="h-10 w-10 animate-spin" />
                        ) : (
                          <Upload size={40} />
                        )}
                      </div>
                    )}
                  </div>
                  <label className="bg-matrimony-600 hover:bg-matrimony-700 text-white px-4 py-2 rounded-full cursor-pointer">
                    {avatarUrl ? 'Change Photo' : 'Upload Photo'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleFileUpload} 
                      disabled={isUploading}
                    />
                  </label>
                  <p className="text-sm text-matrimony-500 dark:text-matrimony-400 mt-2">
                    Photos help get 5x more matches
                  </p>
                </div>
              </div>

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
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your height" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[200px] overflow-y-auto">
                              {heightOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              placeholder="Start typing your city or town"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                searchLocations(e.target.value);
                              }}
                            />
                          </FormControl>
                          
                          {locationSearchResults.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                              {isSearchingLocation ? (
                                <div className="p-2 text-center text-gray-500">
                                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                                  Searching...
                                </div>
                              ) : (
                                locationSearchResults.map((location, index) => (
                                  <div 
                                    key={index}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                    onClick={() => {
                                      field.onChange(location);
                                      setLocationSearchResults([]);
                                    }}
                                  >
                                    {location}
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                  <FormField
                    control={form.control}
                    name="interests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interests</FormLabel>
                        <FormDescription className="mb-2">
                          Select your interests (select at least one)
                        </FormDescription>
                        <FormControl>
                          <ToggleGroup 
                            type="multiple" 
                            variant="outline"
                            className="flex flex-wrap gap-2"
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            {commonInterests.map(interest => (
                              <ToggleGroupItem 
                                key={interest} 
                                value={interest}
                                className="rounded-full border border-gray-200 px-3 py-1 text-sm"
                              >
                                {interest}
                              </ToggleGroupItem>
                            ))}
                          </ToggleGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default ProfileSetup;
