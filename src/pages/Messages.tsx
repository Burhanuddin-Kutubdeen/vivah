
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedTransition from '@/components/AnimatedTransition';
import ConversationList, { Conversation } from '@/components/messages/ConversationList';
import ConversationArea from '@/components/messages/ConversationArea';
import { Message } from '@/components/messages/MessageList';
import { sampleConversations, sampleMessages } from '@/components/messages/messagesData';

const Messages = () => {
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>(sampleConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(sampleConversations[0]);
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  
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
    }
  }, [searchParams, conversations]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = (messageText: string) => {
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

  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />

        <main className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h1 className="text-2xl font-bold mb-6">Messages</h1>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex h-[calc(100vh-200px)] max-h-[800px]">
              <ConversationList 
                conversations={conversations}
                selectedConversation={selectedConversation}
                onSelectConversation={handleSelectConversation}
              />
              <ConversationArea 
                conversation={selectedConversation}
                messages={messages}
                onSendMessage={handleSendMessage}
              />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default Messages;
