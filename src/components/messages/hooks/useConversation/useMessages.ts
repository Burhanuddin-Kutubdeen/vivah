
import { useState, useEffect } from 'react';
import { Message, isSuapabaseMessage } from '../../types/messageTypes';
import { api } from '@/services/api';

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

        // Fetch messages from the API
        const data = await api.messages.getMessages(conversationId);

        if (!data) {
          setMessages([]);
          setIsLoading(false);
          return;
        }

        // Format messages for the UI
        const formattedMessages: Message[] = data.map(msg => ({
          id: msg.id,
          conversation_id: msg.conversation_id,
          text: msg.text,
          sender_id: msg.sender_id,
          receiver_id: msg.receiver_id,
          created_at: msg.created_at,
          read: msg.read,
          image_url: msg.image_url || null
        }));

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
    };

    fetchMessages();
  }, [conversationId, userId]);

  return { messages, isLoading, error };
};
