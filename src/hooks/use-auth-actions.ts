
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { registerUser, loginUser, removeAuthToken, setAuthToken } from '@/utils/api-service';

export const useAuthActions = () => {
  const { toast } = useToast();

  // Sign up handler
  const signUp = useCallback(async (email: string, password: string) => {
    try {
      const data = await registerUser(email, password);
      if (data?.token) {
        setAuthToken(data.token);

        toast({
          title: "Registration successful",
          description: "Welcome to Vivah!",
        });
        return { data: { message: "Registration successful" }, error: null };
      } else {
        throw new Error(data?.message || "Registration failed");
      }
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error?.message || "An unknown error occurred",
        variant: "destructive",
      });
      return { data: null, error: { message: error?.message || "Registration failed" } };
    }
  }, [toast]);

  // Sign in handler
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const data = await loginUser(email, password);
      if (data?.token) {
        setAuthToken(data.token);

        toast({
          title: "Login successful",
          description: "Welcome back to Vivah!",
        });
        return { data: { message: "Login successful" }, error: null };
      } else {
        throw new Error(data?.message || "Login failed");
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error?.message || "Please check your email and password",
        variant: "destructive",
      });
      return { data: null, error: { message: error?.message || "Login failed" } };
    }
  }, [toast]);

  // Sign out handler
  const signOut = useCallback(async () => {
    removeAuthToken();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  }, [toast]);

  return { signUp, signIn, signOut };
};
