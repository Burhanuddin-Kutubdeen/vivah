
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConversationList, { Conversation } from '@/components/messages/ConversationList';
import ConversationArea from '@/components/messages/ConversationArea';
import MessageRequests from '@/components/messages/MessageRequests';

const Messages: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  
  const userId = searchParams.get('userId');
  const name = searchParams.get('name');

  useEffect(() => {
    if (userId && name) {
      const conversation: Conversation = {
        id: userId,
        person: {
          name: decodeURIComponent(name),
          imageUrl: 'https://via.placeholder.com/150',
          isOnline: true
        },
        lastMessage: '',
        lastMessageTime: 'now',
        unread: false
      };
      setSelectedConversation(conversation);
    }
  }, [userId, name]);

  const handleAcceptRequest = (userId: string, name: string) => {
    const conversation: Conversation = {
      id: userId,
      person: {
        name: name,
        imageUrl: 'https://via.placeholder.com/150',
        isOnline: true
      },
      lastMessage: '',
      lastMessageTime: 'now',
      unread: false
    };
    setSelectedConversation(conversation);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to view messages.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <Tabs defaultValue="messages" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="messages" className="flex-1">Messages</TabsTrigger>
              <TabsTrigger value="requests" className="flex-1">Message Requests</TabsTrigger>
            </TabsList>
            
            <TabsContent value="messages" className="mt-0">
              <div className="flex h-[calc(100vh-120px)]">
                <ConversationList 
                  selectedConversation={selectedConversation}
                  onSelectConversation={setSelectedConversation}
                />
                <ConversationArea 
                  conversation={selectedConversation}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="requests" className="mt-0">
              <div className="p-6">
                <MessageRequests onAccept={handleAcceptRequest} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Messages;
