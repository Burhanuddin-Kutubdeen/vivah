
import React from 'react';
import { X } from 'lucide-react';

interface ImagePreviewProps {
  imagePreview: string | null;
  onClear: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imagePreview, onClear }) => {
  if (!imagePreview) return null;
  
  return (
    <div className="mb-2 relative">
      <div className="relative inline-block">
        <img 
          src={imagePreview} 
          alt="Selected attachment" 
          className="max-h-32 rounded-lg border border-gray-200 dark:border-gray-600" 
        />
        <button 
          onClick={onClear}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ImagePreview;
