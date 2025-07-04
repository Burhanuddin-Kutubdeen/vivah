
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { MoreVertical } from 'lucide-react';
import { Conversation } from './ConversationList';
import { api } from '@/services/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ConversationHeaderProps {
  conversation: Conversation;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({ conversation }) => {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!conversation.id) return;
      
      try {
        const data = await api.profiles.get(conversation.id);
        
        if (!data) return;
        
        setFirstName(data.first_name);
        setLastName(data.last_name);
      } catch (err) {
        console.error('Error fetching profile data:', err);
      }
    };
    
    fetchProfileData();
  }, [conversation.id]);
  
  const displayName = firstName || lastName ? 
    [firstName, lastName].filter(Boolean).join(' ') : 
    conversation.person.name;

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <img 
          src={conversation.person.imageUrl} 
          alt={displayName} 
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h2 className="font-medium">{displayName}</h2>
          <p className="text-xs text-matrimony-500 dark:text-matrimony-400">
            {conversation.person.isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreVertical className="h-5 w-5 text-matrimony-600 dark:text-matrimony-300" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="text-red-500 cursor-pointer">
              Block User
            </DropdownMenuItem>
            <DropdownMenuItem className="text-yellow-500 cursor-pointer">
              Report User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ConversationHeader;
