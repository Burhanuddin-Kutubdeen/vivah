
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle, Loader2 } from 'lucide-react';
import { useProfileMessage } from '@/hooks/use-profile-message';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface MessageButtonProps {
  profileId: string;
  name: string;
}

const MessageButton: React.FC<MessageButtonProps> = ({ profileId, name }) => {
  const [isMessaging, setIsMessaging] = useState(false);
  const { handleMessage } = useProfileMessage(profileId);
  const navigate = useNavigate();

  const onMessageClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!profileId) return;
    
    setIsMessaging(true);
    
    try {
      const result = handleMessage(profileId, name);
      
      if (result) {
        // The handleMessage function already handles navigation and toast notifications
      } else {
        toast.error("Failed to send message request. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error("Message error:", error);
    } finally {
      setIsMessaging(false);
    }
  };

  return (
    <Button 
      onClick={onMessageClick}
      size="sm" 
      disabled={isMessaging}
      className="bg-matrimony-600 hover:bg-matrimony-700 text-white rounded-full flex-1 transition-colors duration-300"
    >
      {isMessaging ? (
        <Loader2 size={16} className="mr-1 animate-spin" />
      ) : (
        <MessageCircle size={16} className="mr-1" />
      )}
      Message
    </Button>
  );
};

export default MessageButton;
