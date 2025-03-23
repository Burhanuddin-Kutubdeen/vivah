
import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import ImagePreview from './components/ImagePreview';
import MessageTextarea from './components/MessageTextarea';
import AttachImageButton from './components/AttachImageButton';
import SendButton from './components/SendButton';
import { useImageUpload } from './hooks/useImageUpload';

interface MessageInputProps {
  onSendMessage: (message: string, imageUrl?: string) => Promise<boolean>;
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const debouncedIsTyping = useDebounce(isTyping, 1000);
  
  const {
    imagePreview,
    isUploading,
    handleFileChange,
    clearSelectedImage,
    uploadImage
  } = useImageUpload();

  useEffect(() => {
    if (isTyping && onStartTyping) {
      onStartTyping();
    }
  }, [isTyping, onStartTyping]);
  
  useEffect(() => {
    if (!debouncedIsTyping && onStopTyping) {
      onStopTyping();
    }
  }, [debouncedIsTyping, onStopTyping]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);
    if (e.target.value.length > 0 && !isTyping) {
      setIsTyping(true);
    } else if (e.target.value.length === 0 && isTyping) {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    // Don't send if there's no message and no image, or if already sending
    if ((messageInput.trim() === '' && !imagePreview) || isSending || isDisabled) return;
    
    setIsSending(true);
    try {
      let imageUrl = null;
      
      // Upload image if selected
      if (imagePreview) {
        imageUrl = await uploadImage();
        if (!imageUrl && messageInput.trim() === '') {
          // If image upload failed and there's no text message, don't proceed
          setIsSending(false);
          return;
        }
      }
      
      const success = await onSendMessage(messageInput, imageUrl || undefined);
      if (success) {
        setMessageInput('');
        clearSelectedImage();
        setIsTyping(false);
        if (onStopTyping) onStopTyping();
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <ImagePreview 
        imagePreview={imagePreview} 
        onClear={clearSelectedImage} 
      />
      
      <div className="flex items-end space-x-2">
        <div className="flex-1 bg-matrimony-50 dark:bg-gray-700 border border-transparent rounded-xl p-2 flex flex-col">
          <MessageTextarea
            value={messageInput}
            onChange={handleMessageChange}
            onKeyDown={handleKeyPress}
            disabled={isDisabled}
          />
          
          <div className="flex justify-between items-center px-2">
            <div className="flex space-x-2">
              <AttachImageButton
                onFileSelect={handleFileChange}
                disabled={isDisabled || isUploading}
              />
            </div>
          </div>
        </div>
        
        <SendButton
          onClick={sendMessage}
          disabled={(!messageInput.trim() && !imagePreview) || isSending || isDisabled || isUploading}
          isLoading={isSending || isUploading}
        />
      </div>
    </div>
  );
};

export default MessageInput;
