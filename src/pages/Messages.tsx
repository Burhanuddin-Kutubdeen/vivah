
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedTransition from '@/components/AnimatedTransition';
import ConversationList, { Conversation } from '@/components/messages/ConversationList';
import ConversationArea from '@/components/messages/ConversationArea';
import MessageRequests from '@/components/messages/MessageRequests';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useOnlineStatus } from '@/hooks/use-online-status';
import PremiumUpgradeButton from '@/components/discovery/PremiumUpgradeButton';
import { useMessageRequests } from '@/components/messages/hooks/useMessageRequests';

const Messages = () => {
  const [searchParams] = useSearchParams();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [activeTab, setActiveTab] = useState<string>('messages');
  const { user } = useAuth();
  const navigate = useNavigate();
  const isOffline = useOnlineStatus();
  const isOnline = !isOffline; // Fix the type issue by directly using the boolean value
  const { requests } = useMessageRequests();
  
  // Check for URL parameters and set initial conversation
  useEffect(() => {
    const userId = searchParams.get('userId');
    const name = searchParams.get('name');
    
    if (userId && name) {
      // Create a temporary conversation from URL params until the real one loads
      const conversation: Conversation = {
        id: userId,
        person: {
          name: decodeURIComponent(name),
          imageUrl: '/placeholder.svg',
          isOnline: false,
        },
        lastMessage: 'Loading...',
        lastMessageTime: 'Just now',
        unread: false,
      };
      
      setSelectedConversation(conversation);
      // Switch to messages tab if coming from a direct link
      setActiveTab('messages');
    }
  }, [searchParams]);
  
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    
    // Update URL without navigating
    const url = new URL(window.location.href);
    url.searchParams.set('userId', conversation.id);
    url.searchParams.set('name', conversation.person.name);
    window.history.pushState({}, '', url);
  };
  
  const handleAcceptRequest = (userId: string, name: string) => {
    // Navigate to open the conversation with this user
    navigate(`/messages?userId=${userId}&name=${encodeURIComponent(name)}`);
    // Switch to conversations tab
    setActiveTab('messages');
  };

  // Check if user is premium - for now just set to false, will implement later
  const isPremium = false;

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
            
            {!isOnline && (
              <Alert className="mb-4">
                <AlertDescription>
                  You're currently offline. Some features may be limited until your connection is restored.
                </AlertDescription>
              </Alert>
            )}
            
            {!isPremium && (
              <div className="mb-6">
                <PremiumUpgradeButton isOffline={!isOnline} />
              </div>
            )}
            
            <Tabs defaultValue="messages" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6 grid w-full grid-cols-2 bg-matrimony-50 dark:bg-gray-800">
                <TabsTrigger value="messages" className="relative">
                  Conversations
                </TabsTrigger>
                <TabsTrigger value="requests" className="relative">
                  Message Requests
                  {requests.length > 0 && (
                    <Badge variant="destructive" className="ml-2 bg-matrimony-600">
                      {requests.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="messages" className="mt-0">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex h-[calc(100vh-200px)] max-h-[800px]">
                  <ConversationList 
                    selectedConversation={selectedConversation}
                    onSelectConversation={handleSelectConversation}
                  />
                  <ConversationArea 
                    conversation={selectedConversation}
                    isPremium={isPremium}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="requests" className="mt-0">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                  <h2 className="text-lg font-medium mb-4">Pending Message Requests</h2>
                  <MessageRequests onAccept={handleAcceptRequest} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default Messages;
