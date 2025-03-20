
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Admirer {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  date_of_birth: string | null;
}

export const useAdmirers = () => {
  const [admirers, setAdmirers] = useState<Admirer[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchAdmirers = async () => {
      if (!user) return;
      
      try {
        // First get the likes data
        const { data: likesData, error: likesError } = await supabase
          .from('likes')
          .select('user_id')
          .eq('liked_profile_id', user.id)
          .eq('status', 'pending');
          
        if (likesError) throw likesError;
        
        // If we have likes data, fetch the admirer profiles
        if (likesData && likesData.length > 0) {
          const admirerIds = likesData.map(like => like.user_id);
          
          // Get all the admirer profiles
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, avatar_url, date_of_birth')
            .in('id', admirerIds);
            
          if (profilesError) throw profilesError;
          
          if (profilesData) {
            setAdmirers(profilesData as Admirer[]);
          }
        }
      } catch (err) {
        console.error('Error fetching admirers:', err);
        toast({
          title: "Error",
          description: "Failed to load admirers",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdmirers();
  }, [user]);

  return {
    admirers,
    loading
  };
};
