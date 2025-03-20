
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from '@supabase/supabase-js';

export const useAuthState = (onUserChange: (userId: string | null) => void) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Initializing auth state...");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event);
        setSession(newSession);
        setUser(newSession?.user || null);
        
        // Notify about user change
        if (newSession?.user) {
          console.log("User authenticated:", newSession.user.id);
          onUserChange(newSession.user.id);
        } else {
          console.log("User not authenticated");
          onUserChange(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
      } else {
        console.log("Got session:", data.session ? "Yes" : "No");
        setSession(data.session);
        setUser(data.session?.user || null);
        
        // Notify about user change
        if (data.session?.user) {
          console.log("User from session:", data.session.user.id);
          onUserChange(data.session.user.id);
        } else {
          console.log("No user in session");
          onUserChange(null);
        }
      }
      
      setLoading(false);
    };

    getSession();

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [onUserChange]);

  return { user, session, loading };
};
