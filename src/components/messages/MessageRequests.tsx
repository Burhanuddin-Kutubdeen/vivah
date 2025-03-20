
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Sender {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

interface MessageRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
  sender: Sender;
}

interface MessageRequestsProps {
  onAccept: (userId: string, name: string) => void;
}

const MessageRequests: React.FC<MessageRequestsProps> = ({ onAccept }) => {
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
                sender: profileData as Sender
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
  
  const handleAccept = async (request: MessageRequest) => {
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
      onAccept(request.sender.id, fullName);
      
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
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-matrimony-500" />
      </div>
    );
  }
  
  if (requests.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium mb-3">Message Requests</h2>
      <div className="space-y-3">
        {requests.map((request) => {
          const fullName = `${request.sender.first_name || ''} ${request.sender.last_name || ''}`.trim();
          
          return (
            <div key={request.id} className="flex items-center p-3 border border-matrimony-100 dark:border-matrimony-700 rounded-lg">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={request.sender.avatar_url || ''} alt={fullName} />
                <AvatarFallback>{fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium">{fullName}</h3>
                <p className="text-sm text-matrimony-500">
                  Wants to message you
                </p>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => handleDecline(request)}
                  disabled={processingId === request.id}
                >
                  {processingId === request.id ? 
                    <Loader2 className="h-4 w-4 animate-spin" /> : 
                    <XCircle className="h-5 w-5" />
                  }
                </Button>
                
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-green-500 hover:text-green-600 hover:bg-green-50"
                  onClick={() => handleAccept(request)}
                  disabled={processingId === request.id}
                >
                  {processingId === request.id ? 
                    <Loader2 className="h-4 w-4 animate-spin" /> : 
                    <CheckCircle className="h-5 w-5" />
                  }
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MessageRequests;
