
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [messageInput, setMessageInput] = useState('');

  const sendMessage = () => {
    if (messageInput.trim() === '') return;
    onSendMessage(messageInput);
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
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
  );
};

export default MessageInput;
