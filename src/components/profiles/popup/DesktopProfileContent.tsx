
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Heart, MessageCircle } from 'lucide-react';
import { ProfileData } from '../hooks/useProfileData';
import { ProfileDetail } from './ProfileDetail';
import { calculateAge } from '@/utils/profile-utils';

interface DesktopProfileContentProps {
  profile: ProfileData | null;
  isLoading: boolean;
  error: string | null;
  hasLiked: boolean;
  isLiking: boolean;
  onLike: () => void;
  onMessage: () => void;
  onClose: () => void;
}

export const DesktopProfileContent: React.FC<DesktopProfileContentProps> = ({ 
  profile, 
  isLoading, 
  error, 
  hasLiked, 
  isLiking, 
  onLike, 
  onMessage, 
  onClose 
}) => {
  if (isLoading) {
    return <div className="flex items-center justify-center h-[600px]">Loading profile...</div>;
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] p-6">
        <p className="text-red-500">Failed to load profile</p>
        <Button className="mt-4" onClick={onClose}>Close</Button>
      </div>
    );
  }

  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ');
  const age = profile.date_of_birth ? calculateAge(profile.date_of_birth) : null;

  return (
    <div className="flex h-[600px]">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-2 right-2 z-10"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <div className="w-1/2 h-full">
        <img 
          src={profile.avatar_url || '/placeholder.svg'} 
          alt={fullName} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="w-1/2 h-full overflow-auto p-6">
        <h2 className="text-2xl font-bold mb-1">{fullName}{age ? `, ${age}` : ''}</h2>
        <p className="text-matrimony-600 dark:text-matrimony-400 mb-6">
          {profile.job || 'No occupation specified'} • {profile.location || 'No location specified'}
        </p>
        
        {profile.interests && profile.interests.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, idx) => (
                <Badge key={idx} variant="secondary">{interest}</Badge>
              ))}
            </div>
          </div>
        )}
        
        {profile.bio && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">About</h3>
            <p className="text-matrimony-600 dark:text-matrimony-400">{profile.bio}</p>
          </div>
        )}
        
        <Separator className="my-6" />
        
        <div className="space-y-3 mb-8">
          <ProfileDetail label="Religion" value={profile.religion} />
          <ProfileDetail label="Civil Status" value={profile.civil_status} />
          <ProfileDetail label="Education" value={profile.education} />
          <ProfileDetail label="Has Children" value={profile.has_kids} />
          <ProfileDetail label="Wants Children" value={profile.wants_kids} />
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-full"
            onClick={onLike}
            disabled={isLiking || hasLiked}
          >
            <Heart className={`h-4 w-4 mr-2 ${hasLiked ? 'text-red-500 fill-red-500' : ''}`} />
            {hasLiked ? 'Liked' : 'Like'}
          </Button>
          <Button
            className="flex-1 rounded-full"
            onClick={onMessage}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Message
          </Button>
        </div>
      </div>
    </div>
  );
};
