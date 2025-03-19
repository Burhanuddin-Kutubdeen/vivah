
import React from 'react';
import ConversationHeader from './ConversationHeader';
import MessageList, { Message } from './MessageList';
import MessageInput from './MessageInput';
import { Conversation } from './ConversationList';

interface ConversationAreaProps {
  conversation: Conversation;
  messages: Message[];
  onSendMessage: (message: string) => void;
}

const ConversationArea: React.FC<ConversationAreaProps> = ({
  conversation,
  messages,
  onSendMessage
}) => {
  return (
    <div className="flex-1 flex flex-col">
      <ConversationHeader conversation={conversation} />
      <MessageList messages={messages} />
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
};

export default ConversationArea;
