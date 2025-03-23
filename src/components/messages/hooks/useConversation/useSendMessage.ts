
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

interface UseSendMessageProps {
  conversationId: string | null;
  user: User | null;
}

export const useSendMessage = ({ conversationId, user }: UseSendMessageProps) => {
  // Function to check if image_url column exists in the messages table
  const checkImageUrlColumnExists = async () => {
    try {
      const { error: columnCheckError } = await supabase
        .from('messages')
        .select('image_url')
        .limit(1);
      
      return !columnCheckError;
    } catch (columnError) {
      console.warn('Error checking for image_url column:', columnError);
      return false;
    }
  };

  // Function to create a new message object
  const createMessageObject = (text: string, imageUrl?: string) => {
    const newMessage = {
      conversation_id: conversationId!,
      sender_id: user!.id,
      receiver_id: conversationId!, // In our model, conversation_id is the receiver's user ID
      text: text.trim(),
      created_at: new Date().toISOString(),
      read: false
    };

    return newMessage;
  };

  // Function to insert message into database
  const insertMessageToDatabase = async (messageObject: any) => {
    try {
      const { error } = await supabase
        .from('messages')
        .insert(messageObject);

      if (error) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message');
        return false;
      }

      console.log("Message sent successfully");
      return true;
    } catch (error) {
      console.error('Unexpected error sending message:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  };

  // Send message function
  const sendMessage = async (text: string, imageUrl?: string) => {
    // Validate inputs
    if (!conversationId || !user || (!text.trim() && !imageUrl)) return false;

    try {
      console.log("Sending message to:", conversationId);
      
      // Create the base message object
      const newMessage = createMessageObject(text);

      // Add image_url only if the feature is used and available
      if (imageUrl) {
        const columnExists = await checkImageUrlColumnExists();
        
        if (columnExists) {
          (newMessage as any).image_url = imageUrl;
        } else {
          console.warn('image_url column not found in messages table, skipping image attachment');
        }
      }

      // Insert message into database
      return await insertMessageToDatabase(newMessage);
    } catch (error) {
      console.error('Unexpected error in sendMessage:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  };

  return { sendMessage };
};
