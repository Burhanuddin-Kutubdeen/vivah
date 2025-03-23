
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedTransition from '@/components/AnimatedTransition';
import ConversationList, { Conversation } from '@/components/messages/ConversationList';
import ConversationArea from '@/components/messages/ConversationArea';
import MessageRequests from '@/components/messages/MessageRequests';
import { Message } from '@/components/messages/MessageList';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Messages = () => {
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Fetch conversations when component mounts
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);
  
  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      
      // In a real app, we would fetch real conversations from Supabase
      // For now, we'll create some simple conversations based on liked profiles
      const { data: likedProfiles, error: likesError } = await supabase
        .from('likes')
        .select('liked_profile_id, status')
        .eq('user_id', user?.id)
        .eq('status', 'matched');
        
      if (likesError) {
        console.error('Error fetching likes:', likesError);
        return;
      }
      
      if (likedProfiles && likedProfiles.length > 0) {
        const profileIds = likedProfiles.map(like => like.liked_profile_id);
        
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url')
          .in('id', profileIds);
          
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          return;
        }
        
        if (profiles && profiles.length > 0) {
          const conversationsList = profiles.map(profile => {
            // Format the conversation for the UI
            const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ');
            const displayName = fullName.trim() || "User";
            
            return {
              id: profile.id,
              person: {
                name: displayName,
                imageUrl: profile.avatar_url || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
                isOnline: false,
              },
              lastMessage: 'Start a conversation...',
              lastMessageTime: 'Just now',
              unread: false,
            };
          });
          
          setConversations(conversationsList);
          
          // Handle URL parameters for opening specific conversations
          const userId = searchParams.get('userId');
          if (userId) {
            const existingConversation = conversationsList.find(conv => conv.id === userId);
            
            if (existingConversation) {
              setSelectedConversation(existingConversation);
              fetchMessages(userId);
            } else {
              // Create a new conversation from URL params
              const userName = searchParams.get('name') || 'User';
              const newConversation: Conversation = {
                id: userId,
                person: {
                  name: decodeURIComponent(userName),
                  imageUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
                  isOnline: false,
                },
                lastMessage: 'Start a conversation...',
                lastMessageTime: 'Just now',
                unread: false,
              };
              
              setConversations(prev => [newConversation, ...prev]);
              setSelectedConversation(newConversation);
              setMessages([]);
            }
          } else if (conversationsList.length > 0) {
            // Select the first conversation by default if none is specified in URL
            setSelectedConversation(conversationsList[0]);
            fetchMessages(conversationsList[0].id);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchMessages = async (conversationId: string) => {
    try {
      // In a real app, we would fetch real messages from the database
      // For this implementation, we'll use an empty array since we don't have a messages table
      setMessages([]);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.id);
    
    // Update URL without navigating
    const url = new URL(window.location.href);
    url.searchParams.set('userId', conversation.id);
    url.searchParams.set('name', conversation.person.name);
    window.history.pushState({}, '', url);
  };

  const handleSendMessage = (messageText: string) => {
    if (!selectedConversation) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'user',
      text: messageText,
      timestamp: 'Just now',
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Update last message in conversations list
    setConversations(prevConversations => 
      prevConversations.map(conversation => 
        conversation.id === selectedConversation.id 
          ? { 
              ...conversation, 
              lastMessage: messageText,
              lastMessageTime: 'Just now',
              unread: false 
            } 
          : conversation
      )
    );
    
    // In a real app, we would save the message to the database here
    toast.success('Message sent!');
  };
  
  const handleAcceptRequest = (userId: string, name: string) => {
    // Navigate to open the conversation with this user
    navigate(`/messages?userId=${userId}&name=${encodeURIComponent(name)}`);
  };

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <AnimatedTransition>
        <div className="min-h-screen bg-white dark:bg-gray-900">
          <Navbar />
          <main className="pt-24 pb-16 px-4">
            <div className="container mx-auto max-w-6xl">
              <Alert>
                <AlertDescription>
                  Please log in to access your messages.
                </AlertDescription>
              </Alert>
            </div>
          </main>
          <Footer />
        </div>
      </AnimatedTransition>
    );
  }

  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />

        <main className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h1 className="text-2xl font-bold mb-6">Messages</h1>
            
            <MessageRequests onAccept={handleAcceptRequest} />
            
            {isLoading ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 flex justify-center items-center h-[400px]">
                <p className="text-matrimony-500">Loading conversations...</p>
              </div>
            ) : conversations.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center">
                <h2 className="text-xl font-medium mb-2">No Conversations Yet</h2>
                <p className="text-matrimony-500 mb-4">
                  When you match with someone or receive a message request, you'll see it here.
                </p>
                <button 
                  className="text-matrimony-600 font-medium"
                  onClick={() => navigate('/discover')}
                >
                  Discover Profiles
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex h-[calc(100vh-200px)] max-h-[800px]">
                <ConversationList 
                  conversations={conversations}
                  selectedConversation={selectedConversation}
                  onSelectConversation={handleSelectConversation}
                />
                {selectedConversation ? (
                  <ConversationArea 
                    conversation={selectedConversation}
                    messages={messages}
                    onSendMessage={handleSendMessage}
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-500">Select a conversation to start messaging</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default Messages;
