
import React from 'react';
import { MessageRequest } from './types/messageTypes';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  
  return (
    <div className="flex items-center p-3 border border-matrimony-100 dark:border-matrimony-700 rounded-lg">
      <Avatar className="h-10 w-10 mr-3">
        <AvatarImage src={request.sender.avatar_url || ''} alt={fullName} />
        <AvatarFallback>{fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium">{fullName}</h3>
        <p className="text-sm text-matrimony-500">
          Wants to message you
        </p>
      </div>
      
      <div className="flex space-x-2">
        <Button 
          size="sm" 
          variant="ghost" 
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => onDecline(request)}
          disabled={processingId === request.id}
        >
          {processingId === request.id ? 
            <Loader2 className="h-4 w-4 animate-spin" /> : 
            <XCircle className="h-5 w-5" />
          }
        </Button>
        
        <Button 
          size="sm" 
          variant="ghost" 
          className="text-green-500 hover:text-green-600 hover:bg-green-50"
          onClick={() => onAccept(request)}
          disabled={processingId === request.id}
        >
          {processingId === request.id ? 
            <Loader2 className="h-4 w-4 animate-spin" /> : 
            <CheckCircle className="h-5 w-5" />
          }
        </Button>
      </div>
    </div>
  );
};

export default MessageRequestItem;
