
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { signUpUser, signInUser, signOutUser } from '@/lib/auth-utils';
import { useNavigate } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';

export const useAuthActions = (
  setIsProfileComplete: (value: boolean) => void,
  checkProfileCompletion: (userId: string) => Promise<boolean>,
  navigateBasedOnProfile: (userId: string, forceCheck?: boolean) => Promise<void>
) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Sign up handler
  const signUp = useCallback(async (email: string, password: string, userData: any) => {
    const onSignUpSuccess = (newUser: User) => {
      // Set profile as incomplete and navigate to profile setup
      setIsProfileComplete(false);
      
      toast({
        title: "Registration successful",
        description: "Welcome to Vivah! Let's set up your profile.",
      });
      
      navigate('/profile-setup');
    };
    
    const result = await signUpUser(email, password, userData, onSignUpSuccess);
    
    if (result.error) {
      // Enhanced error handling with more specific messages
      if (result.error.message.includes("invalid")) {
        toast({
          title: "Email validation failed",
          description: "For development, use a valid test email (like user@example.com) or try an email service like Mailinator (user@mailinator.com).",
          variant: "destructive",
        });
      } else if (result.error.message.includes("already registered")) {
        toast({
          title: "Email already registered",
          description: "This email is already in use. Please try logging in instead.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration failed",
          description: result.error.message,
          variant: "destructive",
        });
      }
    }
    
    return result;
  }, [toast, navigate, setIsProfileComplete]);

  // Sign in handler
  const signIn = useCallback(async (email: string, password: string) => {
    const onSignInSuccess = async (loggedInUser: User) => {
      toast({
        title: "Login successful",
        description: "Welcome to Vivah!",
      });
      
      // Simplified navigation - directly to discover page
      navigate('/discover');
    };
    
    const result = await signInUser(email, password, onSignInSuccess);
    
    if (result.error) {
      toast({
        title: "Login failed",
        description: result.error.message,
        variant: "destructive",
      });
    }
    
    return result;
  }, [toast, navigate]);

  // Sign out handler
  const signOut = useCallback(async () => {
    await signOutUser();
    // Reset profile completion state
    setIsProfileComplete(false);
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  }, [toast, navigate, setIsProfileComplete]);

  return {
    signUp,
    signIn,
    signOut
  };
};
