
import React, { createContext, useContext, useCallback, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import type { User, Session } from '@supabase/supabase-js';
import { signUpUser, signInUser, signOutUser } from '@/lib/auth-utils';
import { useProfile } from '@/hooks/use-profile';
import { useAuthState } from '@/hooks/use-auth-state';

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isProfileComplete: boolean;
  setIsProfileComplete: (value: boolean) => void;
  checkProfileCompletion: (userId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    isProfileComplete: profileIsComplete, 
    setIsProfileComplete: setProfileIsComplete, 
    checkProfileCompletion: checkProfileStatus,
    profileCheckError
  } = useProfile();
  
  // Expose profile completion state at the auth context level
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const profileCheckInProgress = useRef(false);
  
  // Handle user change with debouncing to prevent excessive profile checks
  const handleUserChange = useCallback(async (userId: string | null) => {
    if (userId && !profileCheckInProgress.current) {
      profileCheckInProgress.current = true;
      try {
        const isComplete = await checkProfileStatus(userId);
        setIsProfileComplete(isComplete);
      } catch (error) {
        console.error("Error checking profile on user change:", error);
      } finally {
        profileCheckInProgress.current = false;
      }
    }
  }, [checkProfileStatus]);

  // Auth state management
  const { user, session, loading } = useAuthState(handleUserChange);
  
  // Function to check profile completion that updates both states
  const checkProfileCompletion = useCallback(async (userId: string) => {
    if (profileCheckInProgress.current) {
      console.log("Profile check already in progress, using cached state");
      return isProfileComplete;
    }
    
    profileCheckInProgress.current = true;
    try {
      const isComplete = await checkProfileStatus(userId);
      setIsProfileComplete(isComplete);
      return isComplete;
    } catch (error) {
      console.error("Error in checkProfileCompletion:", error);
      // On error, maintain previous state
      return isProfileComplete;
    } finally {
      profileCheckInProgress.current = false;
    }
  }, [checkProfileStatus, isProfileComplete]);
  
  // Update local state when profile status changes
  useEffect(() => {
    setIsProfileComplete(profileIsComplete);
  }, [profileIsComplete]);
  
  // Show toast for persistent profile check errors
  useEffect(() => {
    if (profileCheckError && user) {
      toast({
        title: "Connection issue",
        description: "We're having trouble verifying your profile status. Some features may be limited.",
        variant: "destructive",
      });
    }
  }, [profileCheckError, user, toast]);

  // Sign up handler
  const signUp = async (email: string, password: string, userData: any) => {
    const onSignUpSuccess = (newUser: User, newSession: Session | null) => {
      // Set profile as incomplete and navigate to profile setup
      setIsProfileComplete(false);
      setProfileIsComplete(false);
      
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
  };

  // Sign in handler
  const signIn = async (email: string, password: string) => {
    const onSignInSuccess = async (loggedInUser: User) => {
      toast({
        title: "Login successful",
        description: "Welcome to Vivah!",
      });
      
      // Check if profile is complete
      let isComplete = false;
      try {
        isComplete = await checkProfileCompletion(loggedInUser.id);
      } catch (error) {
        console.error("Error checking profile on sign in:", error);
      }
      
      // Add a short delay to ensure state updates are processed
      setTimeout(() => {
        // Redirect to profile setup if profile is not complete, otherwise to discover page
        if (!isComplete) {
          navigate('/profile-setup', { replace: true });
        } else {
          navigate('/discover', { replace: true });
        }
      }, 300);
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
  };

  // Sign out handler
  const signOut = async () => {
    await signOutUser();
    // Reset profile completion state
    setIsProfileComplete(false);
    setProfileIsComplete(false);
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        isProfileComplete,
        setIsProfileComplete: (value) => {
          setIsProfileComplete(value);
          setProfileIsComplete(value);
        },
        checkProfileCompletion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
