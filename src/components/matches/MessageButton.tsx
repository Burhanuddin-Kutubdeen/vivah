
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle, Loader2 } from 'lucide-react';
import { useProfileMessage } from '@/hooks/use-profile-message';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface MessageButtonProps {
  profileId: string;
  name: string;
}

const MessageButton: React.FC<MessageButtonProps> = ({ profileId, name }) => {
  const { isMessaging, messageSent, handleMessageRequest } = useProfileMessage(profileId);
  const navigate = useNavigate();
  const { toast } = useToast();

  const onMessageClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!profileId) return;
    
    const result = await handleMessageRequest();
    
    if (result.success) {
      // Navigate to messages page with specific user conversation
      navigate(`/messages?userId=${profileId}&name=${encodeURIComponent(name)}`);
      
      toast({
        title: "Message Request Sent",
        description: `You'll be able to message ${name} once they accept your request`,
      });
    } else if (result.error && !messageSent) {
      toast({
        title: "Error",
        description: result.error || "Failed to send message request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={onMessageClick}
      size="sm" 
      disabled={isMessaging}
      className={`${
        messageSent
          ? "bg-matrimony-100 text-matrimony-700 hover:bg-matrimony-200"
          : "bg-matrimony-600 hover:bg-matrimony-700 text-white"
      } rounded-full flex-1 transition-colors duration-300`}
    >
      {isMessaging ? (
        <Loader2 size={16} className="mr-1 animate-spin" />
      ) : (
        <MessageCircle size={16} className="mr-1" />
      )}
      {messageSent ? "Request Sent" : "Message"}
    </Button>
  );
};

export default MessageButton;
