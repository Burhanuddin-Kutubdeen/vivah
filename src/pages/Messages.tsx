
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedTransition from '@/components/AnimatedTransition';
import ConversationList, { Conversation } from '@/components/messages/ConversationList';
import ConversationArea from '@/components/messages/ConversationArea';
import MessageRequests from '@/components/messages/MessageRequests';
import { Message } from '@/components/messages/MessageList';
import { sampleConversations, sampleMessages } from '@/components/messages/messagesData';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Messages = () => {
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>(sampleConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Handle URL parameters for opening specific conversations
  useEffect(() => {
    const userId = searchParams.get('userId');
    const userName = searchParams.get('name');
    
    if (userId && userName) {
      // Check if conversation already exists
      const existingConversation = conversations.find(conv => conv.id === userId);
      
      if (existingConversation) {
        setSelectedConversation(existingConversation);
      } else {
        // Create a new conversation
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
    } else if (conversations.length > 0 && !selectedConversation) {
      // Select the first conversation by default
      setSelectedConversation(conversations[0]);
    }
  }, [searchParams, conversations, selectedConversation]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    
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
    
    setMessages([...messages, newMessage]);
    
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
          </div>
        </main>

        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default Messages;
