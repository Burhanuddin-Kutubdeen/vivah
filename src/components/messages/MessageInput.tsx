
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Send, Image, Paperclip, Smile, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<boolean>;
  onStartTyping?: () => void;
  onStopTyping?: () => void;
  isDisabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  onStartTyping,
  onStopTyping,
  isDisabled = false 
}) => {
  const [messageInput, setMessageInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debouncedIsTyping = useDebounce(isTyping, 1000);

  // Auto-resize the textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [messageInput]);
  
  // Handle typing indicator
  useEffect(() => {
    if (isTyping && onStartTyping) {
      onStartTyping();
    }
  }, [isTyping, onStartTyping]);
  
  // Stop typing when debounced value changes to false
  useEffect(() => {
    if (!debouncedIsTyping && onStopTyping) {
      onStopTyping();
    }
  }, [debouncedIsTyping, onStopTyping]);

  const sendMessage = async () => {
    if (messageInput.trim() === '' || isSending || isDisabled) return;
    
    setIsSending(true);
    try {
      const success = await onSendMessage(messageInput);
      if (success) {
        setMessageInput('');
        setIsTyping(false);
        if (onStopTyping) onStopTyping();
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);
    // Set typing indicator when user types
    if (e.target.value.length > 0 && !isTyping) {
      setIsTyping(true);
    } else if (e.target.value.length === 0 && isTyping) {
      setIsTyping(false);
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-end space-x-2">
        <div className="flex-1 bg-matrimony-50 dark:bg-gray-700 border border-transparent rounded-xl p-2 flex flex-col">
          <textarea
            ref={textareaRef}
            className="bg-transparent border-0 w-full resize-none focus:outline-none focus:ring-0 min-h-[40px] max-h-[150px] p-2"
            placeholder={isDisabled ? "Premium required to send messages" : "Type your message..."}
            value={messageInput}
            onChange={handleMessageChange}
            onKeyDown={handleKeyPress}
            disabled={isDisabled}
            rows={1}
          />
          
          <div className="flex justify-between items-center px-2">
            <div className="flex space-x-2">
              <button className="text-matrimony-400 hover:text-matrimony-600 dark:hover:text-matrimony-300 p-1 rounded-full" disabled={isDisabled}>
                <Paperclip className="h-5 w-5" />
              </button>
              <button className="text-matrimony-400 hover:text-matrimony-600 dark:hover:text-matrimony-300 p-1 rounded-full" disabled={isDisabled}>
                <Image className="h-5 w-5" />
              </button>
              <button className="text-matrimony-400 hover:text-matrimony-600 dark:hover:text-matrimony-300 p-1 rounded-full" disabled={isDisabled}>
                <Smile className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        <Button 
          className="rounded-full h-12 w-12 bg-matrimony-600 hover:bg-matrimony-700 flex-shrink-0"
          onClick={sendMessage}
          disabled={!messageInput.trim() || isSending || isDisabled}
        >
          {isSending ? 
            <Loader2 className="h-5 w-5 animate-spin" /> : 
            <Send className="h-5 w-5" />
          }
        </Button>
      </div>
      
      {isDisabled && (
        <div className="mt-2 text-center">
          <Button 
            variant="link" 
            className="text-matrimony-600 text-xs font-medium"
            onClick={() => window.location.href = '/premium'}
          >
            Upgrade to Premium to unlock unlimited messaging
          </Button>
        </div>
      )}
    </div>
  );
};

export default MessageInput;
