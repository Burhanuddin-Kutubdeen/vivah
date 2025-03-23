
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Message } from './types/messageTypes';
import { format } from 'date-fns';
import { Loader2, Check, CheckCheck } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  isTyping?: boolean;
  conversationName?: string;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  isLoading, 
  isTyping = false,
  conversationName = "User"
}) => {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);
  
  const formatMessageTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return format(date, 'h:mm a');
    } catch (e) {
      return '';
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-matrimony-500" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 text-center">
        <div className="max-w-md">
          <h3 className="text-lg font-medium mb-2">No messages yet</h3>
          <p className="text-matrimony-500">
            Send a message to start the conversation
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        const isCurrentUser = message.sender_id === user?.id;
        
        return (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                isCurrentUser 
                  ? 'bg-matrimony-600 text-white' 
                  : 'bg-matrimony-100 dark:bg-gray-700 text-matrimony-800 dark:text-matrimony-200'
              }`}
            >
              {!isCurrentUser && (
                <div className="text-xs font-medium text-matrimony-600 dark:text-matrimony-300 mb-1">
                  {conversationName}
                </div>
              )}
              <p className="break-words">{message.text}</p>
              <div className="flex items-center justify-end mt-1">
                <span className={`text-xs ${
                  isCurrentUser 
                    ? 'text-matrimony-200' 
                    : 'text-matrimony-500 dark:text-matrimony-400'
                }`}>
                  {formatMessageTime(message.created_at)}
                </span>
                {isCurrentUser && (
                  <span className="ml-1 text-xs text-matrimony-200 flex items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {message.read ? 
                            <CheckCheck className="h-3 w-3 ml-1" /> : 
                            <Check className="h-3 w-3 ml-1" />
                          }
                        </TooltipTrigger>
                        <TooltipContent>
                          {message.read ? 'Read' : 'Delivered'}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
      
      {/* Typing indicator */}
      {isTyping && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-start"
        >
          <div className="bg-matrimony-100 dark:bg-gray-700 text-matrimony-800 dark:text-matrimony-200 rounded-2xl px-4 py-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-matrimony-500 animate-bounce" style={{animationDelay: '0ms'}} />
              <div className="w-2 h-2 rounded-full bg-matrimony-500 animate-bounce" style={{animationDelay: '150ms'}} />
              <div className="w-2 h-2 rounded-full bg-matrimony-500 animate-bounce" style={{animationDelay: '300ms'}} />
            </div>
          </div>
        </motion.div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
