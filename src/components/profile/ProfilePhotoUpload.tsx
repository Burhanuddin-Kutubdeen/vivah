
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';
import { api } from '@/services/api';
import { toast } from 'sonner';

interface ProfilePhotoUploadProps {
  onUploadComplete: (url: string) => void;
  currentUrl?: string;
}

const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({ 
  onUploadComplete, 
  currentUrl 
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await api.files.uploadAvatar(file);
      onUploadComplete(response.url);
      toast.success('Photo uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {currentUrl && (
        <img 
          src={currentUrl} 
          alt="Profile" 
          className="w-32 h-32 rounded-full object-cover"
        />
      )}
      
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="photo-upload"
        />
        <label htmlFor="photo-upload">
          <Button 
            type="button" 
            variant="outline" 
            disabled={isUploading}
            className="cursor-pointer"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload Photo'}
          </Button>
        </label>
      </div>
    </div>
  );
};

export default ProfilePhotoUpload;
