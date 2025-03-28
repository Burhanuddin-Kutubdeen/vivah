
import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useConversationList } from './hooks/useConversationList';

interface Person {
  name: string;
  imageUrl: string;
  isOnline: boolean;
}

export interface Conversation {
  id: string;
  person: Person;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
}

interface ConversationListProps {
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  selectedConversation,
  onSelectConversation
}) => {
  const { conversations, isLoading } = useConversationList();

  if (isLoading) {
    return (
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-matrimony-500" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium">Messages</h2>
        </div>
        <div className="p-6 text-center">
          <p className="text-matrimony-500 dark:text-matrimony-400 mb-2">No conversations yet</p>
          <p className="text-sm text-matrimony-400 dark:text-matrimony-500">
            When you match with someone, you'll be able to message them here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-1/3 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium">Messages</h2>
      </div>
      <div className="overflow-y-auto h-[calc(100%-60px)]">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            className={`w-full text-left p-4 flex items-start space-x-3 border-b border-gray-100 dark:border-gray-700 hover:bg-matrimony-50 dark:hover:bg-gray-700 transition-colors ${selectedConversation && selectedConversation.id === conversation.id ? 'bg-matrimony-50 dark:bg-gray-700' : ''}`}
            onClick={() => onSelectConversation(conversation)}
          >
            <div className="relative flex-shrink-0">
              <img 
                src={conversation.person.imageUrl} 
                alt={conversation.person.name} 
                className="w-12 h-12 rounded-full object-cover"
              />
              {conversation.person.isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                <h3 className="font-medium truncate">{conversation.person.name || "Anonymous"}</h3>
                <span className="text-xs text-matrimony-500 dark:text-matrimony-400">{conversation.lastMessageTime}</span>
              </div>
              <p className={`text-sm truncate mt-1 ${conversation.unread ? 'font-medium text-matrimony-700 dark:text-matrimony-300' : 'text-matrimony-500 dark:text-matrimony-400'}`}>
                {conversation.lastMessage}
              </p>
            </div>
            {conversation.unread && (
              <span className="w-2 h-2 rounded-full bg-matrimony-600 flex-shrink-0 mt-2"></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
