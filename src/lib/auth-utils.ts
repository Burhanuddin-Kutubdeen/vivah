
import { api } from '@/services/api';

// Authentication utility functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const signUpUser = async (
  email: string, 
  password: string, 
  userData: any,
  onSuccess: (user: any, session: any) => void
) => {
  try {
    console.log("Signing up with:", email);
    
    // Validate email format
    if (!validateEmail(email)) {
      return { 
        error: { 
          message: "Invalid email format" 
        },
        data: null
      };
    }
    
    const data = await api.auth.signUp(email, password, {
      first_name: userData.firstName,
      last_name: userData.lastName,
    });

    console.log("User registered successfully:", data.user.id);
    
    // Store auth token
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    
    onSuccess(data.user, data.session || null);
    
    return { error: null, data };
  } catch (error: any) {
    console.error("Registration error:", error);
    return { error, data: null };
  }
};

export const signInUser = async (
  email: string, 
  password: string,
  onSuccess: (user: any) => void
) => {
  try {
    console.log("Signing in with:", email);
    
    const data = await api.auth.signIn(email, password);

    console.log("User logged in successfully:", data.user.id);
    
    // Store auth token
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    
    onSuccess(data.user);
    
    return { error: null, data };
  } catch (error: any) {
    console.error("Login error:", error);
    return { error, data: null };
  }
};

export const signOutUser = async () => {
  try {
    await api.auth.signOut();
    localStorage.removeItem('auth_token');
    return { error: null };
  } catch (error: any) {
    console.error("Logout error:", error);
    return { error };
  }
};

export const resetPassword = async (email: string) => {
  try {
    console.log("Requesting password reset for:", email);
    
    // Validate email format
    if (!validateEmail(email)) {
      return { 
        error: { 
          message: "Invalid email format" 
        },
        data: null 
      };
    }
    
    const data = await api.auth.resetPassword(email);
    
    return { error: null, data };
  } catch (error: any) {
    console.error("Password reset error:", error);
    return { error, data: null };
  }
};
