
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { isValidUUID } from '@/utils/validation';

export const useProfileMessage = (profileId?: string) => {
  const navigate = useNavigate();
  const [isMessaging, setIsMessaging] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const handleMessage = (id: string, name: string) => {
    // For numeric IDs (sample profiles), just simulate success
    if (/^\d+$/.test(id)) {
      toast(`Starting conversation with ${name}`, {
        description: "This is a sample profile. In a real app, you would be messaging a real user."
      });
      
      // Don't navigate for sample profiles
      setMessageSent(true);
      return true;
    }
    
    if (!isValidUUID(id)) {
      toast.error("Cannot message profile - invalid ID format");
      return false;
    }
    
    // Navigate to messages page with this specific conversation open
    navigate(`/messages?userId=${id}&name=${encodeURIComponent(name)}`);
    
    toast(`Starting conversation with ${name}`, {
      description: "You can now message each other"
    });
    
    setMessageSent(true);
    return true;
  };

  const handleMessageRequest = async () => {
    setIsMessaging(true);
    
    try {
      if (!profileId) {
        return { success: false, error: "Invalid profile ID" };
      }
      
      // For numeric IDs (sample profiles), just simulate success
      if (/^\d+$/.test(profileId)) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setMessageSent(true);
        return { success: true };
      }
      
      if (!isValidUUID(profileId)) {
        return { success: false, error: "Invalid profile ID format" };
      }
      
      // In a real app, we would make an API call here to send the message request
      // For now, we'll just simulate a successful request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMessageSent(true);
      return { success: true };
    } catch (error) {
      console.error("Error sending message request:", error);
      return { success: false, error: "Failed to send message request" };
    } finally {
      setIsMessaging(false);
    }
  };

  return { 
    isMessaging, 
    messageSent, 
    handleMessage,
    handleMessageRequest 
  };
};
