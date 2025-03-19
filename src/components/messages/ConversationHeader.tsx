
import React from 'react';
import { Button } from "@/components/ui/button";
import { Phone, Video, InfoIcon, MoreVertical } from 'lucide-react';
import { Conversation } from './ConversationList';

interface ConversationHeaderProps {
  conversation: Conversation;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({ conversation }) => {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <img 
          src={conversation.person.imageUrl} 
          alt={conversation.person.name} 
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h2 className="font-medium">{conversation.person.name}</h2>
          <p className="text-xs text-matrimony-500 dark:text-matrimony-400">
            {conversation.person.isOnline ? 'Online' : 'Offline'}
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
  );
};

export default ConversationHeader;
