
import React, { createContext, useContext, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { User, Session } from '@supabase/supabase-js';
import { useAuthState } from '@/hooks/use-auth-state';
import { useProfileManagement } from '@/hooks/use-profile-management';
import { useAuthActions } from '@/hooks/use-auth-actions';

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ error: any } | undefined>;
  isProfileComplete: boolean;
  setIsProfileComplete: (value: boolean) => void;
  checkProfileCompletion: (userId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  // Profile management (state and functions)
  const {
    isProfileComplete,
    setIsProfileComplete,
    checkProfileCompletion,
    handleUserChange,
    navigateBasedOnProfile,
    profileCheckError
  } = useProfileManagement();
  
  // Auth state management
  const { user, session, loading } = useAuthState(handleUserChange);
  
  // Auth actions (sign up, sign in, sign out)
  const { signUp, signIn, signOut, forgotPassword } = useAuthActions(
    setIsProfileComplete,
    checkProfileCompletion,
    navigateBasedOnProfile
  );
  
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

  // Computed property to check if user is authenticated
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAuthenticated,
        signUp,
        signIn,
        signOut,
        forgotPassword,
        isProfileComplete,
        setIsProfileComplete,
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
