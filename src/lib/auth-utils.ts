
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import type { User, Session } from '@supabase/supabase-js';

// Authentication utility functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const signUpUser = async (
  email: string, 
  password: string, 
  userData: any,
  onSuccess: (user: User, session: Session | null) => void
) => {
  try {
    console.log("Signing up with:", email);
    
    // Validate email format before sending to Supabase
    if (!validateEmail(email)) {
      return { 
        error: { 
          message: "Invalid email format" 
        } 
      };
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
      return { error };
    }

    // If registration successful, call the onSuccess callback
    if (data.user) {
      onSuccess(data.user, data.session);
    }
    
    return { error: null };
  } catch (error: any) {
    console.error("Unexpected registration error:", error);
    return { error };
  }
};

export const signInUser = async (
  email: string, 
  password: string,
  onSuccess: (user: User) => void
) => {
  try {
    console.log("Signing in with:", email);
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      return { error };
    }

    // If logged in successfully, call the onSuccess callback
    if (data.user) {
      onSuccess(data.user);
    }
    
    return { error: null };
  } catch (error: any) {
    console.error("Unexpected login error:", error);
    return { error };
  }
};

export const signOutUser = async () => {
  return await supabase.auth.signOut();
};
