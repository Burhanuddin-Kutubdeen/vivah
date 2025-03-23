
import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Send, Image, Loader2, X } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const debouncedIsTyping = useDebounce(isTyping, 1000);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [messageInput]);
  
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image is too large. Maximum size is 5MB.');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed.');
        return;
      }
      
      setSelectedImage(file);
      
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedImage) return null;
    
    setIsUploading(true);
    try {
      // Create a unique file name
      const fileExt = selectedImage.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `chat-images/${fileName}`;
      
      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('chat-attachments')
        .upload(filePath, selectedImage);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data } = supabase.storage
        .from('chat-attachments')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const sendMessage = async () => {
    // Don't send if there's no message and no image, or if already sending
    if ((messageInput.trim() === '' && !selectedImage) || isSending || isDisabled) return;
    
    setIsSending(true);
    try {
      let imageUrl = null;
      
      // Upload image if selected
      if (selectedImage) {
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);
    if (e.target.value.length > 0 && !isTyping) {
      setIsTyping(true);
    } else if (e.target.value.length === 0 && isTyping) {
      setIsTyping(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      {/* Image preview */}
      {imagePreview && (
        <div className="mb-2 relative">
          <div className="relative inline-block">
            <img 
              src={imagePreview} 
              alt="Selected attachment" 
              className="max-h-32 rounded-lg border border-gray-200 dark:border-gray-600" 
            />
            <button 
              onClick={clearSelectedImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      
      <div className="flex items-end space-x-2">
        <div className="flex-1 bg-matrimony-50 dark:bg-gray-700 border border-transparent rounded-xl p-2 flex flex-col">
          <textarea
            ref={textareaRef}
            className="bg-transparent border-0 w-full resize-none focus:outline-none focus:ring-0 min-h-[40px] max-h-[150px] p-2"
            placeholder="Type your message..."
            value={messageInput}
            onChange={handleMessageChange}
            onKeyDown={handleKeyPress}
            disabled={isDisabled}
            rows={1}
          />
          
          <div className="flex justify-between items-center px-2">
            <div className="flex space-x-2">
              <button 
                className="text-matrimony-400 hover:text-matrimony-600 dark:hover:text-matrimony-300 p-1 rounded-full" 
                disabled={isDisabled || isUploading}
                onClick={triggerFileInput}
                type="button"
              >
                <Image className="h-5 w-5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                disabled={isDisabled || isUploading}
              />
            </div>
          </div>
        </div>
        
        <Button 
          className="rounded-full h-12 w-12 bg-matrimony-600 hover:bg-matrimony-700 flex-shrink-0"
          onClick={sendMessage}
          disabled={(!messageInput.trim() && !selectedImage) || isSending || isDisabled || isUploading}
        >
          {isSending || isUploading ? 
            <Loader2 className="h-5 w-5 animate-spin" /> : 
            <Send className="h-5 w-5" />
          }
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
