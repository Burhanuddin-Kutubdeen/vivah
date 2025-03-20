
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { X, ArrowLeft, Heart, MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useProfileData } from './hooks/useProfileData';
import { useProfileLike } from '@/hooks/use-profile-like';
import { useProfileMessage } from '@/hooks/use-profile-message';
import { toast } from 'sonner';
import { useMobile } from '@/hooks/use-mobile';

interface ProfilePopupProps {
  profileId: string;
  onClose: () => void;
}

const ProfilePopup: React.FC<ProfilePopupProps> = ({ 
  profileId, 
  onClose 
}) => {
  const isMobile = useMobile();
  const { profile, isLoading, error } = useProfileData(profileId);
  const { isLiking, hasLiked, handleLike } = useProfileLike(profileId);
  const { handleMessage } = useProfileMessage(profileId);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (profileId) {
      setIsOpen(true);
    }
  }, [profileId]);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };

  const handleLikeProfile = async () => {
    const result = await handleLike();
    if (result.success) {
      toast.success("Profile liked successfully");
    } else {
      toast.error(result.error || "Failed to like profile");
    }
  };

  const handleMessageProfile = () => {
    if (!profile) return;
    
    const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ');
    handleMessage(profileId, fullName);
  };

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <SheetContent side="bottom" className="h-[90vh] p-0 rounded-t-3xl">
          <MobileProfileContent 
            profile={profile}
            isLoading={isLoading}
            error={error}
            hasLiked={hasLiked}
            isLiking={isLiking}
            onLike={handleLikeProfile}
            onMessage={handleMessageProfile}
            onClose={handleClose}
          />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden max-h-[90vh]">
        <DesktopProfileContent 
          profile={profile}
          isLoading={isLoading}
          error={error}
          hasLiked={hasLiked}
          isLiking={isLiking}
          onLike={handleLikeProfile}
          onMessage={handleMessageProfile}
          onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};

// Mobile version of the profile content
const MobileProfileContent = ({ 
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

// Desktop version of the profile content
const DesktopProfileContent = ({ 
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

const ProfileDetail = ({ label, value }) => {
  if (!value) return null;
  
  return (
    <div className="flex justify-between">
      <span className="text-sm text-matrimony-500 dark:text-matrimony-400">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
};

// Helper function to calculate age
function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

export default ProfilePopup;
