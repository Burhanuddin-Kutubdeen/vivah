
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message, isSuapabaseMessage } from '../../types/messageTypes';
import { User } from '@supabase/supabase-js';

interface UseMessagesProps {
  conversationId: string | null;
  user: User | null;
}

export const useMessages = ({ conversationId, user }: UseMessagesProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch messages for the selected conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId || !user) return;

      console.log("Fetching messages for conversation:", conversationId);
      setIsLoading(true);
      try {
        // Get messages where the sender_id and receiver_id match the conversation
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${conversationId}),and(sender_id.eq.${conversationId},receiver_id.eq.${user.id})`)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching messages:', error);
          return;
        }
        
        console.log("Messages data from DB:", data);
        
        // Type guard to ensure we only set valid message objects
        const validMessages = Array.isArray(data) ? 
          data.filter(isSuapabaseMessage) : [];
        
        console.log("Valid messages after filtering:", validMessages);
        setMessages(validMessages);

        // Mark messages as read
        await markMessagesAsRead(validMessages, user.id);
      } catch (error) {
        console.error('Unexpected error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Set up real-time subscription for new messages
    const setupRealtimeSubscription = () => {
      if (!conversationId || !user) return null;

      const channel = supabase
        .channel('messages-channel')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `or(and(sender_id.eq.${user.id},receiver_id.eq.${conversationId}),and(sender_id.eq.${conversationId},receiver_id.eq.${user.id}))`
          },
          (payload) => {
            console.log("New message received:", payload);
            const newMessage = payload.new as Message;
            if (isSuapabaseMessage(newMessage)) {
              setMessages(prev => [...prev, newMessage]);

              // If the message is received (not sent by current user), mark as read
              if (newMessage.receiver_id === user.id) {
                markMessageAsRead(newMessage.id);
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
            filter: `or(and(sender_id.eq.${user.id},receiver_id.eq.${conversationId}),and(sender_id.eq.${conversationId},receiver_id.eq.${user.id}))`
          },
          (payload) => {
            console.log("Message updated:", payload);
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

      return channel;
    };

    const channel = setupRealtimeSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [conversationId, user]);

  // Helper function to mark a single message as read
  const markMessageAsRead = async (messageId: string) => {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', messageId);

    if (error) {
      console.error('Error marking message as read:', error);
    }
  };

  // Helper function to mark multiple messages as read
  const markMessagesAsRead = async (messages: Message[], userId: string) => {
    if (messages.length === 0) return;

    const unreadMessages = messages.filter(
      msg => msg.receiver_id === userId && !msg.read
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
  };

  return { messages, isLoading, setMessages };
};
