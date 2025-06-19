
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
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any; data: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ error: any; data: any } | undefined>;
  isProfileComplete: boolean;
  setIsProfileComplete: (value: boolean) => void;
  checkProfileCompletion: (userId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  // Auth state management (this doesn't use useAuth, so no circular dependency)
  const { user, session, loading } = useAuthState((userId: string | null) => {
    // This callback is passed to useAuthState, will be called when user changes
    if (userId) {
      handleUserChange(userId);
    }
  });
  
  // Profile management (now receives user as parameter to avoid circular dependency)
  const {
    isProfileComplete,
    setIsProfileComplete,
    checkProfileCompletion,
    handleUserChange,
    navigateBasedOnProfile,
    profileCheckError
  } = useProfileManagement(user);
  
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
