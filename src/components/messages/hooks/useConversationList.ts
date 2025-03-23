
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Conversation } from '../ConversationList';
import { toast } from 'sonner';
import { isSuapabaseMessage } from '../types/messageTypes';

export const useConversationList = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // First get all the accepted likes (matches)
        const { data: acceptedLikes, error: likesError } = await supabase
          .from('likes')
          .select('id, user_id, liked_profile_id, status, created_at')
          .or(`user_id.eq.${user.id},liked_profile_id.eq.${user.id}`)
          .eq('status', 'accepted');
          
        if (likesError) {
          console.error('Error fetching likes:', likesError);
          return;
        }
        
        if (!acceptedLikes || acceptedLikes.length === 0) {
          setConversations([]);
          setIsLoading(false);
          return;
        }
        
        // Extract profile IDs to fetch (the other person in each conversation)
        const profileIds = acceptedLikes.map(like => 
          like.user_id === user.id ? like.liked_profile_id : like.user_id
        );
        
        // Remove duplicates
        const uniqueProfileIds = [...new Set(profileIds)];
        
        // Fetch profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url')
          .in('id', uniqueProfileIds);
          
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          return;
        }
        
        if (!profiles || profiles.length === 0) {
          setConversations([]);
          setIsLoading(false);
          return;
        }
        
        // For each profile, get the latest message
        const conversationList: Conversation[] = [];
        
        for (const profile of profiles) {
          // Get the latest message between these users
          const { data: latestMessageData, error: messageError } = await supabase
            .from('messages')
            .select('*')
            .or(`and(sender_id.eq.${user.id},receiver_id.eq.${profile.id}),and(sender_id.eq.${profile.id},receiver_id.eq.${user.id})`)
            .order('created_at', { ascending: false })
            .limit(1);
            
          if (messageError) {
            console.error('Error fetching latest message:', messageError);
          }

          const latestMessage = latestMessageData && latestMessageData.length > 0 && 
            isSuapabaseMessage(latestMessageData[0]) ? latestMessageData[0] : null;
          
          // Format the name
          const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ');
          const displayName = fullName.trim() || 'User';
          
          // Get unread count
          const { count: unreadCount, error: countError } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('sender_id', profile.id)
            .eq('receiver_id', user.id)
            .eq('read', false);
            
          if (countError) {
            console.error('Error counting unread messages:', countError);
          }
          
          conversationList.push({
            id: profile.id,
            person: {
              name: displayName,
              imageUrl: profile.avatar_url || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
              isOnline: false, // We'll implement online status in future enhancements
            },
            lastMessage: latestMessage ? latestMessage.text : 'Start a conversation...',
            lastMessageTime: latestMessage ? formatTime(latestMessage.created_at) : 'Just now',
            unread: (unreadCount || 0) > 0,
          });
        }
        
        // Sort by last message time (newest first)
        conversationList.sort((a, b) => {
          if (a.lastMessageTime === 'Just now' && b.lastMessageTime !== 'Just now') return -1;
          if (a.lastMessageTime !== 'Just now' && b.lastMessageTime === 'Just now') return 1;
          return 0; // Keep original order for now
        });
        
        setConversations(conversationList);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        toast.error('Failed to load conversations');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConversations();
    
    // Set up real-time subscription for new messages
    if (user) {
      const channel = supabase
        .channel('messages-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `or(sender_id.eq.${user.id},receiver_id.eq.${user.id})`
          },
          () => {
            // Refetch conversations when a new message is received
            fetchConversations();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);
  
  const formatTime = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      
      // If today, return time
      if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      
      // If yesterday, return 'Yesterday'
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      }
      
      // If this week, return day name
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      if (date > weekAgo) {
        return date.toLocaleDateString([], { weekday: 'short' });
      }
      
      // Otherwise return date
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch (e) {
      return 'Recently';
    }
  };

  return {
    conversations,
    isLoading
  };
};
