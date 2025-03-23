
import { useState, useEffect } from 'react';
import { Message, isSuapabaseMessage } from '../../types/messageTypes';
import { supabase } from '@/integrations/supabase/client';

interface UseMessagesProps {
  conversationId: string | null;
  userId: string | null;
}

export const useMessages = ({ conversationId, userId }: UseMessagesProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId || !userId) {
        setMessages([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // In a real application, we would fetch messages from Supabase
        // This is simulated for the demo
        setTimeout(async () => {
          try {
            // Fetch profile data for the conversation partner
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('first_name, last_name, avatar_url')
              .eq('id', conversationId)
              .single();

            if (profileError) throw profileError;

            // Create a display name from first_name and last_name
            const firstName = profileData?.first_name || '';
            const lastName = profileData?.last_name || '';
            const conversationName = [firstName, lastName].filter(Boolean).join(' ').trim() || 'Anonymous';

            // Fetch messages between the current user and the conversation partner
            const { data, error } = await supabase
              .from('messages')
              .select('*')
              .or(`and(sender_id.eq.${userId},receiver_id.eq.${conversationId}),and(sender_id.eq.${conversationId},receiver_id.eq.${userId})`)
              .order('created_at', { ascending: true });

            if (error) throw error;

            // Mark messages as read
            if (data && data.length > 0) {
              const unreadMessages = data.filter(
                msg => msg.sender_id === conversationId && !msg.read
              );

              if (unreadMessages.length > 0) {
                const unreadIds = unreadMessages.map(msg => msg.id);
                await supabase
                  .from('messages')
                  .update({ read: true })
                  .in('id', unreadIds);
              }
            }

            // Format messages for the UI - handle image_url which might not exist in the database
            const formattedMessages: Message[] = data ? data.map(msg => ({
              id: msg.id,
              conversation_id: msg.conversation_id,
              text: msg.text,
              sender_id: msg.sender_id,
              receiver_id: msg.receiver_id,
              created_at: msg.created_at,
              read: msg.read,
              image_url: null // Since image_url doesn't exist in the database, default to null
            })) : [];

            setMessages(formattedMessages);
          } catch (err: any) {
            console.error('Error fetching messages:', err);
            setError(err.message || 'Failed to load messages');
            
            // Fallback demo data
            const demoMessages: Message[] = Array(5).fill(null).map((_, i) => ({
              id: `demo-${i}`,
              conversation_id: conversationId,
              text: `This is a sample message ${i + 1}`,
              sender_id: i % 2 === 0 ? userId : conversationId,
              receiver_id: i % 2 === 0 ? conversationId : userId,
              created_at: new Date(Date.now() - (i * 5 * 60000)).toISOString(),
              read: true,
              image_url: null
            }));
            setMessages(demoMessages);
          } finally {
            setIsLoading(false);
          }
        }, 500);
      } catch (err: any) {
        console.error('Error setting up messages fetch:', err);
        setError(err.message || 'An unexpected error occurred');
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Set up real-time subscription for new messages
    const subscription = conversationId && userId ? 
      supabase
        .channel('messages-channel')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `or(and(sender_id=eq.${userId},receiver_id=eq.${conversationId}),and(sender_id=eq.${conversationId},receiver_id=eq.${userId}))`
        }, (payload) => {
          // For real-time messages, ensure they match our Message type
          const newMessage = {
            ...payload.new as any,
            image_url: null // Add image_url field if missing
          } as Message;
          
          setMessages(prev => [...prev, newMessage]);
        })
        .subscribe() : null;

    return () => {
      // Clean up subscription
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [conversationId, userId]);

  return { messages, isLoading, error };
};
