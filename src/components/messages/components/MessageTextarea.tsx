
import React, { useRef, useEffect } from 'react';

interface MessageTextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  disabled: boolean;
}

const MessageTextarea: React.FC<MessageTextareaProps> = ({ 
  value, 
  onChange, 
  onKeyDown, 
  disabled 
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      className="bg-transparent border-0 w-full resize-none focus:outline-none focus:ring-0 min-h-[40px] max-h-[150px] p-2"
      placeholder="Type your message..."
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      disabled={disabled}
      rows={1}
    />
  );
};

export default MessageTextarea;
