
import { api } from '@/services/api';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

interface UseSendMessageProps {
  conversationId: string | null;
  user: User | null;
}

export const useSendMessage = ({ conversationId, user }: UseSendMessageProps) => {
  const sendMessage = async (text: string, imageUrl?: string) => {
    if (!conversationId || !user || (!text.trim() && !imageUrl)) return false;

    try {
      console.log("Sending message to:", conversationId);
      
      const messageData = {
        conversation_id: conversationId,
        sender_id: user.id,
        receiver_id: conversationId,
        text: text.trim(),
        image_url: imageUrl
      };

      await api.messages.send(messageData);
      console.log("Message sent successfully");
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      return false;
    }
  };

  return { sendMessage };
};
