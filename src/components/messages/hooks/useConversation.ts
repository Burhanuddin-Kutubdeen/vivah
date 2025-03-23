
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Message, isSuapabaseMessage } from '../types/messageTypes';
import { toast } from 'sonner';

interface UseConversationProps {
  conversationId: string | null;
}

export const useConversation = ({ conversationId }: UseConversationProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();

  // Fetch messages for the selected conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId || !user) return;

      setIsLoading(true);
      try {
        // Get messages where the conversation_id matches
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching messages:', error);
          return;
        }
        
        // Type guard to ensure we only set valid message objects
        const validMessages = Array.isArray(data) ? 
          data.filter(isSuapabaseMessage) : [];
        
        setMessages(validMessages);

        // Mark messages as read
        if (validMessages.length > 0) {
          const unreadMessages = validMessages.filter(
            msg => msg.receiver_id === user.id && !msg.read
          );

          if (unreadMessages.length > 0) {
            // Update read status
            const { error: updateError } = await supabase
              .from('messages')
              .update({ read: true })
              .in('id', unreadMessages.map(msg => msg.id));

            if (updateError) {
              console.error('Error marking messages as read:', updateError);
            } else {
              // Update local state to show messages as read
              setMessages(prev => 
                prev.map(msg => 
                  unreadMessages.some(unread => unread.id === msg.id) 
                    ? { ...msg, read: true } 
                    : msg
                )
              );
            }
          }
        }
      } catch (error) {
        console.error('Unexpected error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Set up real-time subscription for new messages
    if (conversationId && user) {
      const channel = supabase
        .channel('messages-channel')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`
          },
          (payload) => {
            const newMessage = payload.new as Message;
            if (isSuapabaseMessage(newMessage)) {
              setMessages(prev => [...prev, newMessage]);

              // If the message is received (not sent by current user), mark as read
              if (newMessage.receiver_id === user.id) {
                supabase
                  .from('messages')
                  .update({ read: true })
                  .eq('id', newMessage.id)
                  .then(({ error }) => {
                    if (error) console.error('Error marking message as read:', error);
                  });
              }
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`
          },
          (payload) => {
            const updatedMessage = payload.new as Message;
            if (isSuapabaseMessage(updatedMessage)) {
              // Update the message in our local state
              setMessages(prev => 
                prev.map(msg => 
                  msg.id === updatedMessage.id ? updatedMessage : msg
                )
              );
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [conversationId, user]);

  // Send message function
  const sendMessage = async (text: string) => {
    if (!conversationId || !user || !text.trim()) return false;

    try {
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

      // Message sent successfully
      return true;
    } catch (error) {
      console.error('Unexpected error sending message:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  };

  // Start typing indicator
  const startTyping = async () => {
    if (!conversationId || !user) return;
    
    // In a real implementation, we would send a typing indicator to the server
    // For now, just set the local state
    setIsTyping(true);
  };

  // Stop typing indicator
  const stopTyping = async () => {
    if (!conversationId || !user) return;
    
    // In a real implementation, we would send a typing stop indicator to the server
    // For now, just set the local state
    setIsTyping(false);
  };

  return {
    messages,
    isLoading,
    isTyping,
    sendMessage,
    startTyping,
    stopTyping
  };
};
