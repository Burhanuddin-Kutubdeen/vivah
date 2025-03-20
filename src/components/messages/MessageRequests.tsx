
import React from 'react';
import { Loader2 } from 'lucide-react';
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
    return null;
  }
  
  const onAcceptRequest = (request) => {
    handleAccept(request, onAccept);
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium mb-3">Message Requests</h2>
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
    </div>
  );
};

export default MessageRequests;
