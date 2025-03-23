
import React, { useRef } from 'react';
import { Image } from 'lucide-react';

interface AttachImageButtonProps {
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

const AttachImageButton: React.FC<AttachImageButtonProps> = ({ onFileSelect, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <button 
        className="text-matrimony-400 hover:text-matrimony-600 dark:hover:text-matrimony-300 p-1 rounded-full" 
        disabled={disabled}
        onClick={triggerFileInput}
        type="button"
      >
        <Image className="h-5 w-5" />
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileSelect}
        accept="image/*"
        className="hidden"
        disabled={disabled}
      />
    </>
  );
};

export default AttachImageButton;
