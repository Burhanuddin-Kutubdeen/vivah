
import React from 'react';
import { MessageRequest } from './types/messageTypes';
import { CheckCircle, XCircle, Loader2, Clock, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';

interface MessageRequestItemProps {
  request: MessageRequest;
  processingId: string | null;
  onAccept: (request: MessageRequest) => void;
  onDecline: (request: MessageRequest) => void;
}

const MessageRequestItem: React.FC<MessageRequestItemProps> = ({ 
  request, 
  processingId, 
  onAccept, 
  onDecline 
}) => {
  const fullName = `${request.sender.first_name || ''} ${request.sender.last_name || ''}`.trim();
  const isProcessing = processingId === request.id;
  
  // Format the time as "1 day ago", "2 hours ago", etc.
  const timeAgo = formatDistanceToNow(new Date(request.created_at), { addSuffix: true });
  
  return (
    <div className="flex flex-col p-4 border border-matrimony-100 dark:border-matrimony-700 rounded-lg hover:border-matrimony-200 dark:hover:border-matrimony-600 transition-colors">
      <div className="flex items-center mb-3">
        <Avatar className="h-14 w-14 mr-3">
          <AvatarImage src={request.sender.avatar_url || ''} alt={fullName} />
          <AvatarFallback><User className="h-6 w-6" /></AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-lg">{fullName}</h3>
          <div className="flex items-center text-xs text-matrimony-500">
            <Clock className="h-3 w-3 mr-1" />
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-matrimony-600 dark:text-matrimony-300 mb-4">
        {fullName} wants to connect with you. Would you like to accept their message request?
      </p>
      
      <div className="flex space-x-2 self-end">
        <Button 
          variant="outline"
          size="sm" 
          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-700"
          onClick={() => onDecline(request)}
          disabled={isProcessing}
        >
          {isProcessing ? 
            <Loader2 className="h-4 w-4 animate-spin mr-1" /> : 
            <XCircle className="h-4 w-4 mr-1" />
          }
          Decline
        </Button>
        
        <Button 
          size="sm" 
          className="bg-matrimony-600 hover:bg-matrimony-700 text-white"
          onClick={() => onAccept(request)}
          disabled={isProcessing}
        >
          {isProcessing ? 
            <Loader2 className="h-4 w-4 animate-spin mr-1" /> : 
            <CheckCircle className="h-4 w-4 mr-1" />
          }
          Accept
        </Button>
      </div>
    </div>
  );
};

export default MessageRequestItem;
