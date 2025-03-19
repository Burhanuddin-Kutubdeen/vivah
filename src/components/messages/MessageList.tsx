
import React from 'react';
import { motion } from 'framer-motion';

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`flex ${message.senderId === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`max-w-[80%] ${message.senderId === 'user' ? 'bg-matrimony-600 text-white' : 'bg-matrimony-100 dark:bg-gray-700 text-matrimony-800 dark:text-matrimony-200'} rounded-2xl px-4 py-3`}>
            <p>{message.text}</p>
            <p className={`text-xs mt-1 ${message.senderId === 'user' ? 'text-matrimony-200' : 'text-matrimony-500 dark:text-matrimony-400'}`}>
              {message.timestamp}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MessageList;
