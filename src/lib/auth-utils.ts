
import { supabase } from "@/integrations/supabase/client";
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
        },
        data: null
      };
    }
    
    // Get the current domain for redirecting email verification
    const domain = window.location.origin;
    console.log("Current domain for redirect:", domain);

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
        },
        emailRedirectTo: `${domain}/login?verified=true`,
      },
    });

    if (error) {
      console.error("Registration error:", error);
      return { error, data: null };
    }

    // If registration successful, call the onSuccess callback
    if (data.user) {
      console.log("User registered successfully:", data.user.id);
      onSuccess(data.user, data.session);
    }
    
    return { error: null, data };
  } catch (error: any) {
    console.error("Unexpected registration error:", error);
    return { error, data: null };
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
      return { error, data: null };
    }

    // If logged in successfully, call the onSuccess callback
    if (data.user) {
      console.log("User logged in successfully:", data.user.id);
      onSuccess(data.user);
    }
    
    return { error: null, data };
  } catch (error: any) {
    console.error("Unexpected login error:", error);
    return { error, data: null };
  }
};

export const signOutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error);
      return { error };
    }
    return { error: null };
  } catch (error: any) {
    console.error("Unexpected logout error:", error);
    return { error };
  }
};

export const resetPassword = async (email: string) => {
  try {
    console.log("Requesting password reset for:", email);
    
    // Validate email format before sending to Supabase
    if (!validateEmail(email)) {
      return { 
        error: { 
          message: "Invalid email format" 
        },
        data: null 
      };
    }
    
    const { error, data } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });

    if (error) {
      console.error("Password reset error:", error);
      return { error, data: null };
    }
    
    return { error: null, data };
  } catch (error: any) {
    console.error("Unexpected password reset error:", error);
    return { error, data: null };
  }
};
