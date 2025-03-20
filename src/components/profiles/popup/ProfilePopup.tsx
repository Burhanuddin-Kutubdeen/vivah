
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileProfileContent } from './MobileProfileContent';
import { DesktopProfileContent } from './DesktopProfileContent';
import { useProfileData } from '../hooks/useProfileData';
import { useProfileLike } from '@/hooks/use-profile-like';
import { useProfileMessage } from '@/hooks/use-profile-message';
import { toast } from 'sonner';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface ProfilePopupProps {
  profileId: string;
  onClose: () => void;
}

const ProfilePopup: React.FC<ProfilePopupProps> = ({ 
  profileId, 
  onClose 
}) => {
  const isMobile = useIsMobile();
  const { profile, isLoading, error } = useProfileData(profileId);
  const { isLiking, hasLiked, handleLike } = useProfileLike(profileId);
  const { handleMessage } = useProfileMessage();
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

  // Add DialogTitle with VisuallyHidden to resolve accessibility issue
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden max-h-[90vh]">
        <VisuallyHidden>
          <DialogTitle>Profile Details</DialogTitle>
        </VisuallyHidden>
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

export default ProfilePopup;
