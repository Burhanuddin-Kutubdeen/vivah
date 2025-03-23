
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

interface UseSendMessageProps {
  conversationId: string | null;
  user: User | null;
}

export const useSendMessage = ({ conversationId, user }: UseSendMessageProps) => {
  // Send message function
  const sendMessage = async (text: string) => {
    if (!conversationId || !user || !text.trim()) return false;

    try {
      console.log("Sending message to:", conversationId);
      
      // Create a new message
      const newMessage = {
        conversation_id: conversationId,
        sender_id: user.id,
        receiver_id: conversationId, // In our model, conversation_id is the receiver's user ID
        text: text.trim(),
        created_at: new Date().toISOString(),
        read: false
      };

      // Insert into database
      const { error } = await supabase
        .from('messages')
        .insert(newMessage as any); // Type assertion needed due to Supabase typings issue

      if (error) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message');
        return false;
      }

      console.log("Message sent successfully");
      // Message sent successfully
      return true;
    } catch (error) {
      console.error('Unexpected error sending message:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  };

  return { sendMessage };
};
