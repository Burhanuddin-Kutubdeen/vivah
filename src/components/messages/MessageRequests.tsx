
import React from 'react';
import { Loader2, UserX } from 'lucide-react';
import { MessageRequestsProps } from './types/messageTypes';
import { useMessageRequests } from './hooks/useMessageRequests';
import MessageRequestItem from './MessageRequestItem';

const MessageRequests: React.FC<MessageRequestsProps> = ({ onAccept }) => {
  const { 
    requests, 
    loading, 
    processingId, 
    handleAccept, 
    handleDecline 
  } = useMessageRequests();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-matrimony-500" />
      </div>
    );
  }
  
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
        <UserX className="h-12 w-12 text-matrimony-300 mb-4" />
        <h3 className="text-lg font-medium mb-1">No message requests</h3>
        <p className="text-matrimony-500 dark:text-matrimony-400 max-w-md">
          When someone wants to message you, their request will appear here for you to accept or decline.
        </p>
      </div>
    );
  }
  
  const onAcceptRequest = (request) => {
    handleAccept(request, onAccept);
  };

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <MessageRequestItem
          key={request.id}
          request={request}
          processingId={processingId}
          onAccept={onAcceptRequest}
          onDecline={handleDecline}
        />
      ))}
    </div>
  );
};

export default MessageRequests;
