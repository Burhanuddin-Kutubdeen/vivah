
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from '@supabase/supabase-js';

export const useAuthState = (onUserChange: (userId: string | null) => void) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there's an active session
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
      } else {
        setSession(data.session);
        setUser(data.session?.user || null);
        
        // Notify about user change
        if (data.session?.user) {
          onUserChange(data.session.user.id);
        } else {
          onUserChange(null);
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
        
        // Notify about user change
        if (newSession?.user) {
          onUserChange(newSession.user.id);
        } else {
          onUserChange(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [onUserChange]);

  return { user, session, loading };
};
