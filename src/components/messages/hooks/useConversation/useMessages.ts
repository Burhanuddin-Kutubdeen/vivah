
import { useState, useEffect } from 'react';
import { Message } from '../../types/messageTypes';
import { getMessagesByChatId } from '@/utils/api-service';

export const useMessages = (chatId: string, userId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId || !userId) {
        return;
      }

      try {
        setIsLoading(true);

        const messagesResult = await getMessagesByChatId(chatId);

        if (messagesResult) {
          setMessages(messagesResult);
        }

          // Format messages for the UI
          /* const formattedMessages: Message[] = messagesResult.map(msg => ({
              id: msg.id,
              conversation_id: msg.conversation_id,
              text: msg.text,
              sender_id: msg.sender_id,
              receiver_id: msg.receiver_id,
              created_at: msg.created_at,
              read: msg.read,
              image_url: null // Since image_url doesn't exist in the database, default to null
            }));

          setMessages(formattedMessages); */
        
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
      setIsLoading(false);
    };

    fetchMessages();
  }, [chatId, userId]);
  return { messages, isLoading };
};
