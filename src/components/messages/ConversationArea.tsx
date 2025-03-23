
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

  // Check if messaging is allowed
  const canSendMessages = isPremium || (messages.length > 0);
  
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

  return (
    <div className="flex-1 flex flex-col">
      <ConversationHeader conversation={conversation} />
      <MessageList 
        messages={messages} 
        isLoading={isLoading} 
        isTyping={isTyping} 
      />
      <MessageInput 
        onSendMessage={sendMessage}
        onStartTyping={startTyping}
        onStopTyping={stopTyping}
        isDisabled={!canSendMessages && !isPremium}
      />
    </div>
  );
};

export default ConversationArea;
