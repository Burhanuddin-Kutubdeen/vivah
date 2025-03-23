
import React from 'react';
import ConversationHeader from './ConversationHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Conversation } from './ConversationList';
import { useConversation } from './hooks/useConversation';
import { useAuth } from '@/contexts/AuthContext';

interface ConversationAreaProps {
  conversation: Conversation | null;
  isPremium?: boolean;
}

const ConversationArea: React.FC<ConversationAreaProps> = ({
  conversation,
  isPremium = false
}) => {
  const { user } = useAuth();
  const { messages, isLoading, isTyping, sendMessage, startTyping, stopTyping } = useConversation({ 
    conversationId: conversation?.id || null 
  });

  // Temporarily remove premium wall - allow all messaging
  const canSendMessages = true;
  
  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
        <div className="text-center p-8">
          <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
          <p className="text-matrimony-500 dark:text-matrimony-400">
            Choose a conversation from the list to start messaging
          </p>
        </div>
      </div>
    );
  }

  // Make sure to set the correct online status from the API or source
  const updatedConversation = {
    ...conversation,
    person: {
      ...conversation.person,
      isOnline: true // Set to true to show as online
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <ConversationHeader conversation={updatedConversation} />
      <MessageList 
        messages={messages} 
        isLoading={isLoading} 
        isTyping={isTyping}
        conversationName={conversation.person.name} 
      />
      <MessageInput 
        onSendMessage={sendMessage}
        onStartTyping={startTyping}
        onStopTyping={stopTyping}
        isDisabled={false} // Remove the disabled state completely
      />
    </div>
  );
};

export default ConversationArea;
