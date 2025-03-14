
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Send, Phone, Video, InfoIcon, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

// Sample conversation data
const conversations = [
  {
    id: '1',
    person: {
      name: 'Anushka Perera',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80',
      isOnline: true,
    },
    lastMessage: 'I enjoyed our conversation yesterday. Would love to continue it!',
    lastMessageTime: '10:32 AM',
    unread: true,
  },
  {
    id: '2',
    person: {
      name: 'Raj Patel',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      isOnline: false,
    },
    lastMessage: 'That sounds interesting! What kind of photography do you enjoy?',
    lastMessageTime: 'Yesterday',
    unread: false,
  },
  {
    id: '3',
    person: {
      name: 'Priya Silva',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      isOnline: true,
    },
    lastMessage: 'I love dancing too! Maybe we could go to a dance class together sometime.',
    lastMessageTime: 'Yesterday',
    unread: false,
  },
];

// Sample messages for selected conversation
const sampleMessages = [
  {
    id: '1',
    senderId: 'other',
    text: 'Hi there! I noticed we have a lot of common interests.',
    timestamp: 'Yesterday, 7:32 PM',
  },
  {
    id: '2',
    senderId: 'user',
    text: 'Hello! Yes, I noticed that too. I see you enjoy traveling. What\'s your favorite place you\'ve visited so far?',
    timestamp: 'Yesterday, 7:45 PM',
  },
  {
    id: '3',
    senderId: 'other',
    text: 'I loved visiting Japan! The culture, food, and scenic beauty were amazing. Have you been there?',
    timestamp: 'Yesterday, 8:03 PM',
  },
  {
    id: '4',
    senderId: 'user',
    text: 'Not yet, but it\'s definitely on my bucket list! I\'ve been to Singapore and Thailand though.',
    timestamp: 'Yesterday, 8:10 PM',
  },
  {
    id: '5',
    senderId: 'other',
    text: 'Those are amazing places too! What did you enjoy most about Thailand?',
    timestamp: 'Yesterday, 8:15 PM',
  },
  {
    id: '6',
    senderId: 'user',
    text: 'The food was incredible, and I loved the beaches in Phuket. Also, the temples in Bangkok were breathtaking.',
    timestamp: 'Yesterday, 8:22 PM',
  },
  {
    id: '7',
    senderId: 'other',
    text: 'I enjoyed our conversation yesterday. Would love to continue it!',
    timestamp: 'Today, 10:32 AM',
  },
];

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState(sampleMessages);

  const sendMessage = () => {
    if (messageInput.trim() === '') return;
    
    const newMessage = {
      id: Date.now().toString(),
      senderId: 'user',
      text: messageInput,
      timestamp: 'Just now',
    };
    
    setMessages([...messages, newMessage]);
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />

        <main className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h1 className="text-2xl font-bold mb-6">Messages</h1>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex h-[calc(100vh-200px)] max-h-[800px]">
              {/* Conversations List */}
              <div className="w-1/3 border-r border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-medium">Messages</h2>
                </div>
                <div className="overflow-y-auto h-[calc(100%-60px)]">
                  {conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      className={`w-full text-left p-4 flex items-start space-x-3 border-b border-gray-100 dark:border-gray-700 hover:bg-matrimony-50 dark:hover:bg-gray-700 transition-colors ${selectedConversation.id === conversation.id ? 'bg-matrimony-50 dark:bg-gray-700' : ''}`}
                      onClick={() => setSelectedConversation(conversation)}
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
                          <h3 className="font-medium truncate">{conversation.person.name}</h3>
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

              {/* Conversation */}
              <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={selectedConversation.person.imageUrl} 
                      alt={selectedConversation.person.name} 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h2 className="font-medium">{selectedConversation.person.name}</h2>
                      <p className="text-xs text-matrimony-500 dark:text-matrimony-400">
                        {selectedConversation.person.isOnline ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Phone className="h-5 w-5 text-matrimony-600 dark:text-matrimony-300" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Video className="h-5 w-5 text-matrimony-600 dark:text-matrimony-300" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <InfoIcon className="h-5 w-5 text-matrimony-600 dark:text-matrimony-300" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <MoreVertical className="h-5 w-5 text-matrimony-600 dark:text-matrimony-300" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
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

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-end space-x-2">
                    <textarea
                      className="flex-1 bg-matrimony-50 dark:bg-gray-700 border border-transparent rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-matrimony-500 focus:border-transparent resize-none min-h-[80px]"
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                    />
                    <Button 
                      className="rounded-full h-12 w-12 bg-matrimony-600 hover:bg-matrimony-700 flex-shrink-0"
                      onClick={sendMessage}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default Messages;
