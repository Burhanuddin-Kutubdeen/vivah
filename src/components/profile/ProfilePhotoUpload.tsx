
import React, { useState } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';

interface ProfilePhotoUploadProps {
  userId: string | undefined;
  avatarUrl: string | null;
  setAvatarUrl: (url: string) => void;
}

const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({ userId, avatarUrl, setAvatarUrl }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  // Handle file upload for profile photo
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0 || !userId) {
        return;
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      setIsUploading(true);
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
        });
      
      if (error) {
        throw error;
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path);
      
      setAvatarUrl(urlData.publicUrl);
      
      toast({
        title: "Upload successful",
        description: "Your photo has been uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Profile Photo</h2>
      <div className="flex flex-col items-center justify-center">
        <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-4 relative">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              {isUploading ? (
                <Loader2 className="h-10 w-10 animate-spin" />
              ) : (
                <Upload size={40} />
              )}
            </div>
          )}
        </div>
        <label className="bg-matrimony-600 hover:bg-matrimony-700 text-white px-4 py-2 rounded-full cursor-pointer">
          {avatarUrl ? 'Change Photo' : 'Upload Photo'}
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileUpload} 
            disabled={isUploading}
          />
        </label>
        <p className="text-sm text-matrimony-500 dark:text-matrimony-400 mt-2">
          Photos help get 5x more matches
        </p>
      </div>
    </div>
  );
};

export default ProfilePhotoUpload;
