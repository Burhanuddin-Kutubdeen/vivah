
import React from 'react';
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from 'lucide-react';

interface SendButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
}

const SendButton: React.FC<SendButtonProps> = ({ onClick, disabled, isLoading }) => {
  return (
    <Button 
      className="rounded-full h-12 w-12 bg-matrimony-600 hover:bg-matrimony-700 flex-shrink-0"
      onClick={onClick}
      disabled={disabled}
    >
      {isLoading ? 
        <Loader2 className="h-5 w-5 animate-spin" /> : 
        <Send className="h-5 w-5" />
      }
    </Button>
  );
};

export default SendButton;
