
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { getLike } from '@/utils/api-service';

export interface Like {
  id: string;
  userId: string;
  liked_profile_id: string;
  status: string;
  created_at: string;
}

export const useMessageRequests = (userId: string) => {
  const [likes, setLikes] = useState<Like[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessageRequests = async () => {
      if (!userId) return;

      try {
        const pendingLikes = await getLike(userId, "");
        setLikes(pendingLikes);
      } catch (err) {
        console.error('Error fetching message requests:', err);
        toast({
          title: "Error",
          description: "Failed to load message requests",
          variant: "destructive",
        });
      }
      setLoading(false);
    };

    fetchMessageRequests();
  }, [userId]);

  return {
    likes,
    loading,
  };
};
