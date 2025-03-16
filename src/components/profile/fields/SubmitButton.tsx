
import React from 'react';
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  isSubmitting: boolean;
  text?: string;
  disabled?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ 
  isSubmitting, 
  text = "Complete Profile",
  disabled = false
}) => {
  return (
    <Button 
      type="submit" 
      className="w-full rounded-full bg-matrimony-600 hover:bg-matrimony-700 mt-4 transition-all duration-300"
      disabled={isSubmitting || disabled}
    >
      {isSubmitting ? (
        <div className="flex items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Saving...</span>
        </div>
      ) : (
        text
      )}
    </Button>
  );
};

export default SubmitButton;
