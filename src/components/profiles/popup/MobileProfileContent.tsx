
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Heart, MessageCircle } from 'lucide-react';
import { ProfileData } from '../hooks/useProfileData';
import { ProfileDetail } from './ProfileDetail';
import { calculateAge } from '@/utils/profile-utils';
import { toast } from 'sonner';

interface MobileProfileContentProps {
  profile: ProfileData | null;
  isLoading: boolean;
  error: string | null;
  hasLiked: boolean;
  isLiking: boolean;
  onLike: () => void;
  onMessage: () => void;
  onClose: () => void;
}

export const MobileProfileContent: React.FC<MobileProfileContentProps> = ({ 
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
    return <div className="flex items-center justify-center h-full">Loading profile...</div>;
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <p className="text-red-500">Failed to load profile</p>
        <Button className="mt-4" onClick={onClose}>Close</Button>
      </div>
    );
  }

  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ');
  const age = profile.date_of_birth ? calculateAge(profile.date_of_birth) : null;

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="h-12 flex items-center px-4 border-b">
        <Button variant="ghost" size="icon" onClick={onClose} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="font-medium">{fullName}</h2>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="relative h-80">
          <img 
            src={profile.avatar_url || '/placeholder.svg'} 
            alt={fullName} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold">{fullName}{age ? `, ${age}` : ''}</h2>
          <p className="text-matrimony-600 dark:text-matrimony-400 mb-4">
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
          
          <div className="space-y-3">
            <ProfileDetail label="Religion" value={profile.religion} />
            <ProfileDetail label="Civil Status" value={profile.civil_status} />
            <ProfileDetail label="Education" value={profile.education} />
            <ProfileDetail label="Has Children" value={profile.has_kids} />
            <ProfileDetail label="Wants Children" value={profile.wants_kids} />
          </div>
        </div>
      </div>
      
      <div className="h-16 flex items-center justify-center gap-4 p-4 border-t">
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full border-matrimony-300"
          onClick={onLike}
          disabled={isLiking || hasLiked}
        >
          <Heart className={`h-5 w-5 ${hasLiked ? 'text-red-500 fill-red-500' : ''}`} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full border-matrimony-300"
          onClick={onMessage}
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
