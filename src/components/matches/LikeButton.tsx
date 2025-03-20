
import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProfileLike } from '@/hooks/use-profile-like';
import { useToast } from '@/hooks/use-toast';

interface LikeButtonProps {
  profileId: string;
  name: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ profileId, name }) => {
  const { isLiking, hasLiked, handleLike } = useProfileLike(profileId);
  const { toast } = useToast();

  const onLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!profileId) return;
    
    const result = await handleLike();
    
    if (result.success) {
      toast({
        title: "Interest Shown",
        description: `${name} will be notified of your interest`,
      });
    } else if (result.error && !hasLiked) {
      toast({
        title: "Error",
        description: result.error || "Failed to send like. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={onLikeClick}
      size="sm" 
      disabled={isLiking || hasLiked}
      className={`${
        hasLiked 
          ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200" 
          : "bg-matrimony-100 hover:bg-matrimony-200 text-matrimony-700"
      } rounded-full flex-1 transition-colors duration-300`}
    >
      {isLiking ? (
        <Loader2 size={16} className="mr-1 animate-spin" />
      ) : (
        <Heart size={16} className={`mr-1 ${hasLiked ? "fill-green-500 text-green-500" : ""}`} />
      )}
      {hasLiked ? "Liked" : "Like"}
    </Button>
  );
};

export default LikeButton;
