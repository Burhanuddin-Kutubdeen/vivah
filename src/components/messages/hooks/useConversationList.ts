
import { useState, useEffect } from 'react';
import { Conversation } from '../ConversationList';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { formatDistanceToNow } from 'date-fns';

export const useConversationList = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        const conversationsData = await api.messages.getConversations();

        if (!conversationsData || conversationsData.length === 0) {
          setConversations([]);
          setIsLoading(false);
          return;
        }

        // Format conversations
        const formattedConversations = conversationsData.map((conv: any) => ({
          id: conv.id,
          person: {
            name: conv.person.name || 'Anonymous',
            imageUrl: conv.person.imageUrl || 'https://via.placeholder.com/150',
            isOnline: Math.random() > 0.5 // Random for demo
          },
          lastMessage: conv.lastMessage,
          lastMessageTime: formatDistanceToNow(new Date(conv.lastMessageTime), { addSuffix: true }),
          unread: conv.unread || false
        }));

        setConversations(formattedConversations);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        // Fallback to demo data in case of error
        const demoConversations = Array(5).fill(null).map((_, i) => ({
          id: `demo-${i}`,
          person: {
            name: `Demo User ${i + 1}`,
            imageUrl: `https://randomuser.me/api/portraits/${i % 2 ? 'women' : 'men'}/${i + 1}.jpg`,
            isOnline: Math.random() > 0.5
          },
          lastMessage: 'This is a sample message...',
          lastMessageTime: '5m ago',
          unread: Math.random() > 0.7
        }));
        setConversations(demoConversations);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [user]);

  return { conversations, isLoading };
};
