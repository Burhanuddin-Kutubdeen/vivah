
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
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
        const admirersData = await api.likes.getAdmirers();
        
        if (admirersData) {
          setAdmirers(admirersData as Admirer[]);
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
