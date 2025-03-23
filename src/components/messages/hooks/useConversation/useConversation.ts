
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Message } from '../../types/messageTypes';
import { useMessages } from './useMessages';
import { useSendMessage } from './useSendMessage';
import { useTypingIndicator } from './useTypingIndicator';

interface UseConversationProps {
  conversationId: string | null;
}

export const useConversation = ({ conversationId }: UseConversationProps) => {
  const { user } = useAuth();
  const { messages, isLoading } = useMessages({ conversationId, user });
  const { sendMessage } = useSendMessage({ conversationId, user });
  const { isTyping, startTyping, stopTyping } = useTypingIndicator({ conversationId, user });

  return {
    messages,
    isLoading,
    isTyping,
    sendMessage,
    startTyping,
    stopTyping
  };
};
