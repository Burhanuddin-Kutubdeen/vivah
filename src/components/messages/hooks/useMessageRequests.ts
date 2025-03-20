
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { MessageRequest } from '../types/messageTypes';
import { useAuth } from '@/contexts/AuthContext';

export const useMessageRequests = () => {
  const [requests, setRequests] = useState<MessageRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMessageRequests = async () => {
      if (!user) return;
      
      try {
        // First get the likes data
        const { data: likesData, error: likesError } = await supabase
          .from('likes')
          .select('id, user_id, liked_profile_id, status, created_at')
          .eq('liked_profile_id', user.id)
          .eq('status', 'pending');
          
        if (likesError) throw likesError;
        
        // If we have likes data, fetch the sender profiles
        if (likesData && likesData.length > 0) {
          const messageRequests: MessageRequest[] = [];
          
          // For each like, get the sender profile
          for (const like of likesData) {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('id, first_name, last_name, avatar_url')
              .eq('id', like.user_id)
              .single();
              
            if (profileError) {
              console.error('Error fetching profile:', profileError);
              continue;
            }
            
            if (profileData) {
              messageRequests.push({
                id: like.id,
                sender_id: like.user_id,
                receiver_id: like.liked_profile_id,
                status: like.status,
                created_at: like.created_at,
                sender: profileData as any
              });
            }
          }
          
          setRequests(messageRequests);
        }
      } catch (err) {
        console.error('Error fetching message requests:', err);
        toast({
          title: "Error",
          description: "Failed to load message requests",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessageRequests();
  }, [user]);

  const handleAccept = async (request: MessageRequest, onAcceptCallback: (userId: string, name: string) => void) => {
    if (!user) return;
    
    setProcessingId(request.id);
    
    try {
      // Update the request status
      const { error } = await supabase
        .from('likes')
        .update({ status: 'accepted' })
        .eq('id', request.id);
        
      if (error) throw error;
      
      // Remove from the list
      setRequests(prev => prev.filter(r => r.id !== request.id));
      
      // Get the sender's name
      const fullName = `${request.sender.first_name || ''} ${request.sender.last_name || ''}`.trim();
      
      // Trigger the callback to open the conversation
      onAcceptCallback(request.sender.id, fullName);
      
      toast({
        title: "Request Accepted",
        description: `You can now message ${fullName}`,
      });
    } catch (err) {
      console.error('Error accepting request:', err);
      toast({
        title: "Error",
        description: "Failed to accept request",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };
  
  const handleDecline = async (request: MessageRequest) => {
    if (!user) return;
    
    setProcessingId(request.id);
    
    try {
      // Update the request status
      const { error } = await supabase
        .from('likes')
        .update({ status: 'declined' })
        .eq('id', request.id);
        
      if (error) throw error;
      
      // Remove from the list
      setRequests(prev => prev.filter(r => r.id !== request.id));
      
      toast({
        title: "Request Declined",
        description: "Message request has been declined",
      });
    } catch (err) {
      console.error('Error declining request:', err);
      toast({
        title: "Error",
        description: "Failed to decline request",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  return {
    requests,
    loading,
    processingId,
    handleAccept,
    handleDecline
  };
};
