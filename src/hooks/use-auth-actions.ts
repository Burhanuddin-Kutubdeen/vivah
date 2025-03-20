
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { signUpUser, signInUser, signOutUser, resetPassword } from '@/lib/auth-utils';
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
    const onSignUpSuccess = async (newUser: User) => {
      console.log("Sign up success callback triggered");
      
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
      if (result.error.message?.includes("invalid")) {
        toast({
          title: "Email validation failed",
          description: "Please use a valid email address.",
          variant: "destructive",
        });
      } else if (result.error.message?.includes("already registered")) {
        toast({
          title: "Email already registered",
          description: "This email is already in use. Please try logging in instead.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration failed",
          description: result.error.message || "An unknown error occurred",
          variant: "destructive",
        });
      }
    } else if (!result.data?.user) {
      // If no error but also no user, likely email confirmation required
      toast({
        title: "Check your email",
        description: "Please check your email to confirm your registration.",
      });
    }
    
    return result;
  }, [toast, navigate, setIsProfileComplete]);

  // Sign in handler
  const signIn = useCallback(async (email: string, password: string) => {
    const onSignInSuccess = async (loggedInUser: User) => {
      console.log("Sign in success callback triggered");
      
      toast({
        title: "Login successful",
        description: "Welcome back to Vivah!",
      });
      
      // Check if profile is complete and navigate accordingly
      try {
        const isComplete = await checkProfileCompletion(loggedInUser.id);
        setIsProfileComplete(isComplete);
        
        if (isComplete) {
          navigate('/discover');
        } else {
          navigate('/profile-setup');
        }
      } catch (error) {
        console.error("Error checking profile after login:", error);
        // Default to discover page if profile check fails
        navigate('/discover');
      }
    };
    
    const result = await signInUser(email, password, onSignInSuccess);
    
    if (result.error) {
      let message = "Please check your email and password";
      
      if (result.error.message?.includes("Invalid login")) {
        message = "Invalid email or password. Please try again.";
      } else if (result.error.message) {
        message = result.error.message;
      }
      
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
    }
    
    return result;
  }, [toast, navigate, checkProfileCompletion, setIsProfileComplete]);

  // Sign out handler
  const signOut = useCallback(async () => {
    const result = await signOutUser();
    
    if (result.error) {
      toast({
        title: "Logout failed",
        description: result.error.message || "An error occurred during logout",
        variant: "destructive",
      });
    } else {
      // Reset profile completion state
      setIsProfileComplete(false);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/login');
    }
  }, [toast, navigate, setIsProfileComplete]);

  // Password reset handler
  const forgotPassword = useCallback(async (email: string) => {
    const result = await resetPassword(email);
    
    if (result.error) {
      toast({
        title: "Password reset failed",
        description: result.error.message || "An error occurred",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password reset email sent",
        description: "Please check your email for instructions to reset your password.",
      });
    }
    
    return result;
  }, [toast]);

  return {
    signUp,
    signIn,
    signOut,
    forgotPassword
  };
};
