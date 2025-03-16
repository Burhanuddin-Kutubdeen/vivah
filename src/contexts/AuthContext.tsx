
import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
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
    checkProfileCompletion: checkProfileStatus 
  } = useProfile();
  
  // Expose profile completion state at the auth context level
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  
  // Handle user change
  const handleUserChange = useCallback(async (userId: string | null) => {
    if (userId) {
      const isComplete = await checkProfileStatus(userId);
      setIsProfileComplete(isComplete);
    }
  }, [checkProfileStatus]);

  // Auth state management
  const { user, session, loading } = useAuthState(handleUserChange);
  
  // Function to check profile completion that updates both states
  const checkProfileCompletion = useCallback(async (userId: string) => {
    const isComplete = await checkProfileStatus(userId);
    setIsProfileComplete(isComplete);
    return isComplete;
  }, [checkProfileStatus]);
  
  // Update local state when profile status changes
  useEffect(() => {
    setIsProfileComplete(profileIsComplete);
  }, [profileIsComplete]);

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
      const isComplete = await checkProfileCompletion(loggedInUser.id);
      
      // Redirect to profile setup if profile is not complete, otherwise to discover page
      if (!isComplete) {
        navigate('/profile-setup', { replace: true });
      } else {
        navigate('/discover', { replace: true });
      }
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
