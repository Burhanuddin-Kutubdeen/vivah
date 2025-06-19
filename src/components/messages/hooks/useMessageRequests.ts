
import { useState, useEffect } from 'react';
import { api } from '@/services/api';
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
        // Get admirers (people who liked the current user)
        const admirersData = await api.likes.getAdmirers();
        
        if (admirersData && admirersData.length > 0) {
          const messageRequests: MessageRequest[] = admirersData.map((admirer: any) => ({
            id: admirer.id,
            sender_id: admirer.id,
            receiver_id: user.id,
            status: 'pending',
            created_at: admirer.created_at || new Date().toISOString(),
            sender: {
              id: admirer.id,
              first_name: admirer.first_name,
              last_name: admirer.last_name,
              avatar_url: admirer.avatar_url
            }
          }));
          
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
      // In the API, we would update the like status to accepted
      // For now, just remove from the list and trigger callback
      setRequests(prev => prev.filter(r => r.id !== request.id));
      
      const fullName = `${request.sender.first_name || ''} ${request.sender.last_name || ''}`.trim();
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
