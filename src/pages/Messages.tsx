
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedTransition from '@/components/AnimatedTransition';
import ConversationList, { Conversation } from '@/components/messages/ConversationList';
import ConversationArea from '@/components/messages/ConversationArea';
import MessageRequests from '@/components/messages/MessageRequests';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useOnlineStatus } from '@/hooks/use-online-status';
import PremiumUpgradeButton from '@/components/discovery/PremiumUpgradeButton';

const Messages = () => {
  const [searchParams] = useSearchParams();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isOnlineStatus = useOnlineStatus();
  const isOnline = isOnlineStatus.isOnline; // Fix the type issue by accessing the property directly
  
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
            
            <MessageRequests onAccept={handleAcceptRequest} />
            
            {!isPremium && (
              <div className="mb-6">
                <PremiumUpgradeButton isOffline={!isOnline} />
              </div>
            )}
            
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
          </div>
        </main>

        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default Messages;
