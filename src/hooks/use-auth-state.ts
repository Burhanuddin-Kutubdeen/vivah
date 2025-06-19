
import { useState, useEffect } from 'react';
import { api } from '@/services/api';

export const useAuthState = (onUserChange: (userId: string | null) => void) => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Initializing auth state...");
    
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          console.log("No auth token found");
          onUserChange(null);
          setLoading(false);
          return;
        }

        try {
          const userData = await api.auth.getUser();
          console.log("User authenticated:", userData.id);
          
          setUser(userData);
          setSession({ user: userData, token });
          onUserChange(userData.id);
        } catch (apiError) {
          console.log("Auth check failed, clearing token");
          localStorage.removeItem('auth_token');
          onUserChange(null);
          setUser(null);
          setSession(null);
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
        // Don't clear auth state on initialization errors
        onUserChange(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [onUserChange]);

  return { user, session, loading };
};
