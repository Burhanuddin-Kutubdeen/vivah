
import React, { useState, useEffect } from 'react';
import { Loader2, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';

interface ProfilePhotoUploadProps {
  userId: string | undefined;
  avatarUrl: string | null;
  setAvatarUrl: (url: string) => void;
}

const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({ userId, avatarUrl, setAvatarUrl }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const { toast } = useToast();
  
  // Handle file upload for profile photo
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadError(false);
      
      if (!event.target.files || event.target.files.length === 0) {
        toast({
          title: "Upload failed",
          description: "No file selected",
          variant: "destructive",
        });
        return;
      }
      
      if (!userId) {
        toast({
          title: "Upload failed",
          description: "You must be logged in to upload a photo",
          variant: "destructive",
        });
        return;
      }
      
      const file = event.target.files[0];
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPG, PNG or WebP image.",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      setIsUploading(true);
      setUploadSuccess(false);
      
      console.log("Starting upload for user", userId, "with filename", fileName);
      
      // Set a timeout for the upload
      const uploadTimeout = setTimeout(() => {
        setIsUploading(false);
        setUploadError(true);
        toast({
          title: "Upload timeout",
          description: "The upload is taking too long. Please try again.",
          variant: "destructive",
        });
      }, 30000); // 30 second timeout
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true,
          cacheControl: '3600',
        });
      
      clearTimeout(uploadTimeout);
      
      if (error) {
        console.error("Upload error:", error);
        setUploadError(true);
        throw error;
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path);
      
      console.log("Upload successful, URL:", urlData.publicUrl);
      
      setAvatarUrl(urlData.publicUrl);
      setUploadSuccess(true);
      
      toast({
        title: "Upload successful",
        description: "Your photo has been uploaded successfully",
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadError(true);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Reset success state after a delay
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (uploadSuccess) {
      timer = setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [uploadSuccess]);

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
              onError={(e) => {
                console.error("Image failed to load:", avatarUrl);
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23666" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"%3e%3ccircle cx="12" cy="8" r="5"/%3e%3cpath d="M20 21a8 8 0 0 0-16 0"/%3e%3c/svg%3e';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              {isUploading ? (
                <Loader2 className="h-10 w-10 animate-spin" />
              ) : uploadError ? (
                <AlertCircle className="h-10 w-10 text-red-500" />
              ) : (
                <Upload size={40} />
              )}
            </div>
          )}
          {uploadSuccess && (
            <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
          )}
        </div>
        <label className="bg-matrimony-600 hover:bg-matrimony-700 text-white px-4 py-2 rounded-full cursor-pointer transition-all duration-200">
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
        {!avatarUrl && (
          <p className="text-xs text-red-500 mt-1 font-medium">
            Photo required to complete your profile
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfilePhotoUpload;
