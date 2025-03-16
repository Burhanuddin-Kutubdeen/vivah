
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AnimatedTransition from '@/components/AnimatedTransition';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfilePhotoUpload from '@/components/profile/ProfilePhotoUpload';
import ProfileForm from '@/components/profile/ProfileForm';
import LanguageSelector from '@/components/profile/LanguageSelector';
import { useTranslations } from '@/hooks/use-translations';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const ProfileSetup = () => {
  const { user, isProfileComplete } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const { currentLanguage, setCurrentLanguage, translate } = useTranslations();
  const navigate = useNavigate();
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  const { toast } = useToast();
  
  // Fetch current avatar URL if it exists - with improved error handling
  const fetchProfile = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setConnectionError(false);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .maybeSingle()
        .abortSignal(controller.signal);
      
      clearTimeout(timeoutId);
      
      if (error) {
        console.error("Error fetching avatar:", error);
        setHasError(true);
        
        // Check if it's a network-related error
        if (error.message?.includes('Failed to fetch') || error.message?.includes('fetch failed')) {
          setConnectionError(true);
          toast({
            title: "Connection issue",
            description: "We're having trouble connecting to the server. Please check your internet connection.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error loading profile",
            description: "We couldn't load your profile data. Please refresh the page.",
            variant: "destructive",
          });
        }
      } else if (data?.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.error("Error fetching avatar:", error);
      setHasError(true);
      setConnectionError(true);
      
      toast({
        title: "Connection issue",
        description: "We couldn't connect to the server. Please check your internet connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);
  
  useEffect(() => {
    fetchProfile();
    
    // Retry fetch on online event
    const handleOnline = () => {
      toast({
        title: "Connection restored",
        description: "You're back online. Refreshing profile data.",
      });
      fetchProfile();
    };
    
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [fetchProfile, toast]);
  
  // Redirect if profile is already complete, with improved state handling
  useEffect(() => {
    if (isProfileComplete && !redirectAttempted && !isLoading) {
      console.log("Profile is complete, navigating to discover page");
      setRedirectAttempted(true);
      
      // Add a small delay before navigation to ensure state is settled
      const redirectTimer = setTimeout(() => {
        navigate('/discover', { replace: true });
      }, 500);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [isProfileComplete, navigate, redirectAttempted, isLoading]);

  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-gradient-to-b from-white to-matrimony-50 dark:from-gray-900 dark:to-gray-800">
        <Navbar />
        
        <LanguageSelector 
          currentLanguage={currentLanguage} 
          setCurrentLanguage={setCurrentLanguage} 
        />
        
        <main className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-3xl">
            {connectionError && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Connection Issue</AlertTitle>
                <AlertDescription>
                  There appears to be a problem connecting to the server. Some features may be limited.
                  Your changes will be saved once your connection is restored.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-100 dark:border-gray-700">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">{translate('profile_setup_title')}</h1>
                <p className="text-matrimony-600 dark:text-matrimony-300">
                  {translate('profile_setup_subtitle')}
                </p>
              </div>

              <ProfilePhotoUpload 
                userId={user?.id} 
                avatarUrl={avatarUrl} 
                setAvatarUrl={setAvatarUrl} 
              />

              <ProfileForm 
                avatarUrl={avatarUrl} 
                translate={translate} 
                connectionError={connectionError}
              />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default ProfileSetup;
