
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isProfileComplete: boolean;
  setIsProfileComplete: (value: boolean) => void;
  checkProfileCompletion: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if there's an active session
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
      } else {
        setSession(data.session);
        setUser(data.session?.user || null);
        
        // Check if user profile is complete
        if (data.session?.user) {
          checkProfileCompletion(data.session.user.id);
        }
      }
      
      setLoading(false);
    };

    getSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user || null);
        
        // Check profile completion when auth state changes
        if (newSession?.user) {
          await checkProfileCompletion(newSession.user.id);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Function to check if the user's profile is complete
  const checkProfileCompletion = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('date_of_birth, gender, interests, civil_status, avatar_url')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error checking profile:', error);
        setIsProfileComplete(false);
        return;
      }
      
      // Check if required fields are filled
      const isComplete = !!(
        data.date_of_birth && 
        data.gender && 
        data.interests?.length > 0 && 
        data.civil_status && 
        data.avatar_url
      );
      
      setIsProfileComplete(isComplete);
    } catch (error) {
      console.error('Error in profile check:', error);
      setIsProfileComplete(false);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      console.log("Signing up with:", email);
      
      // Validate email format before sending to Supabase
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast({
          title: "Registration failed",
          description: "Please enter a valid email address format (e.g., user@example.com)",
          variant: "destructive",
        });
        return { error: { message: "Invalid email format" } };
      }
      
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
          },
        },
      });

      if (error) {
        console.error("Registration error:", error);
        
        // Enhanced error handling with more specific messages
        if (error.message.includes("invalid")) {
          toast({
            title: "Email validation failed",
            description: "For development, use a valid test email (like user@example.com) or try an email service like Mailinator (user@mailinator.com).",
            variant: "destructive",
          });
        } else if (error.message.includes("already registered")) {
          toast({
            title: "Email already registered",
            description: "This email is already in use. Please try logging in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Registration failed",
            description: error.message,
            variant: "destructive",
          });
        }
        return { error };
      }

      toast({
        title: "Registration successful",
        description: "Welcome to Mango Matrimony! Let's set up your profile.",
      });

      // If registration successful, auto-login the user
      if (data.user) {
        // Update the user state with new user
        setUser(data.user);
        setSession(data.session);
        
        // Set profile as incomplete and navigate to profile setup
        setIsProfileComplete(false);
        navigate('/profile-setup');
      }
      
      return { error: null };
    } catch (error: any) {
      console.error("Unexpected registration error:", error);
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Signing in with:", email);
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      // If logged in successfully, check if profile is complete
      if (data.user) {
        await checkProfileCompletion(data.user.id);
      }
      
      // Redirect to profile setup if profile is not complete, otherwise to discover page
      if (!isProfileComplete) {
        navigate('/profile-setup');
      } else {
        navigate('/discover');
      }
      
      return { error: null };
    } catch (error: any) {
      console.error("Unexpected login error:", error);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
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
