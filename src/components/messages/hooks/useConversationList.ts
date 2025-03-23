
import { useState, useEffect } from 'react';
import { Conversation } from '../ConversationList';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
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
        
        // In a real application, fetch from the database
        // For this example, simulate loading from API
        setTimeout(async () => {
          try {
            // Fetch profiles that the user has messaged with
            const { data: messagesData, error: messagesError } = await supabase
              .from('messages')
              .select('sender_id, receiver_id, text, created_at, read')
              .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
              .order('created_at', { ascending: false });

            if (messagesError) throw messagesError;

            if (!messagesData || messagesData.length === 0) {
              setConversations([]);
              setIsLoading(false);
              return;
            }

            // Get unique user IDs from conversations (excluding the current user)
            const uniqueUserIds = [...new Set(
              messagesData.map(msg => 
                msg.sender_id === user.id ? msg.receiver_id : msg.sender_id
              )
            )];

            // Fetch profile information for these users
            const { data: profilesData, error: profilesError } = await supabase
              .from('profiles')
              .select('id, first_name, last_name, avatar_url')
              .in('id', uniqueUserIds);

            if (profilesError) throw profilesError;

            // Create a map of user profiles
            const profileMap = new Map();
            profilesData?.forEach(profile => {
              profileMap.set(profile.id, profile);
            });

            // Group messages by conversation partner
            const conversationMap = new Map();
            messagesData.forEach(msg => {
              const partnerId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
              
              if (!conversationMap.has(partnerId)) {
                conversationMap.set(partnerId, {
                  messages: [],
                  unreadCount: 0
                });
              }
              
              conversationMap.get(partnerId).messages.push(msg);
              
              // Count unread messages
              if (msg.sender_id !== user.id && !msg.read) {
                conversationMap.get(partnerId).unreadCount += 1;
              }
            });

            // Format conversations
            const formattedConversations = Array.from(conversationMap.entries()).map(([partnerId, data]) => {
              const profile = profileMap.get(partnerId);
              const lastMessage = data.messages[0]; // Messages are already sorted by created_at desc
              
              // Create display name from first_name and last_name
              const firstName = profile?.first_name || '';
              const lastName = profile?.last_name || '';
              const displayName = [firstName, lastName].filter(Boolean).join(' ').trim();
              
              return {
                id: partnerId,
                person: {
                  name: displayName || 'Anonymous',
                  imageUrl: profile?.avatar_url || 'https://via.placeholder.com/150',
                  isOnline: Math.random() > 0.5 // Random for demo
                },
                lastMessage: lastMessage.text,
                lastMessageTime: formatDistanceToNow(new Date(lastMessage.created_at), { addSuffix: true }),
                unread: data.unreadCount > 0
              };
            });

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
        }, 700); // Simulate network delay
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [user]);

  return { conversations, isLoading };
};
