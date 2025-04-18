
import { useState, useEffect } from 'react';
import { getAuthToken } from '@/utils/api-service';

export const useAuthState = () => {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    console.log("Initializing auth state...");

    const initialToken = getAuthToken();
    setToken(initialToken);
    setLoading(false);

    // getSession();

    return () => {
      console.log("Cleaning up auth state...");
    };
  }, []);

  // useEffect(() => {
  //   const initialToken = getAuthToken();
  //   setToken(initialToken);
  // }, []);

  return {
    loading,
    token,
  };
};
