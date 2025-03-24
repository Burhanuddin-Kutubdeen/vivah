
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useProfileLike } from '@/hooks/use-profile-like';

interface ProfileCardProps {
  profile: {
    id: string;
    name: string;
    age: number;
    occupation: string;
    imageUrl: string;
    location: string;
    interests: string[];
  };
  onSelect: () => void;
}

const LikedProfileCard: React.FC<ProfileCardProps> = ({ profile, onSelect }) => {
  const navigate = useNavigate();
  const { isLiking, hasLiked, handleLike } = useProfileLike(profile.id);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    const result = await handleLike();
    
    if (result.success) {
      if (result.action === 'liked') {
        toast(`You liked ${profile.name}`, {
          description: "If they like you back, you'll match!"
        });
      } else {
        toast(`You unliked ${profile.name}`);
      }
    } else {
      toast.error(result.error || "Failed to process your like");
    }
  };

  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    navigate(`/messages?userId=${profile.id}&name=${encodeURIComponent(profile.name)}`);
    toast(`Starting conversation with ${profile.name}`, {
      description: "You can now message each other"
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer"
      onClick={onSelect}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="h-56 overflow-hidden">
        <img 
          src={profile.imageUrl} 
          alt={profile.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      <div className="p-4">
        <h3 className="font-medium text-lg">{profile.name}, {profile.age}</h3>
        <p className="text-sm text-matrimony-600 dark:text-matrimony-400 mb-2">{profile.occupation}</p>
        <p className="text-xs text-matrimony-500 dark:text-matrimony-300 mb-3">{profile.location}</p>
        
        {profile.interests.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1">
            {profile.interests.slice(0, 2).map((interest, index) => (
              <Badge 
                key={index} 
                variant="secondary"
                className="text-xs"
              >
                {interest}
              </Badge>
            ))}
            {profile.interests.length > 2 && (
              <Badge 
                variant="outline"
                className="text-xs"
              >
                +{profile.interests.length - 2} more
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className={`flex-1 rounded-full ${
              hasLiked 
                ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200" 
                : "border-matrimony-200 hover:text-secondary hover:border-secondary dark:border-gray-700"
            }`}
            onClick={handleLikeClick}
            disabled={isLiking}
          >
            <Heart className={`h-4 w-4 mr-1 ${hasLiked ? "fill-green-500 text-green-500" : ""}`} />
            <span>{hasLiked ? "Liked" : "Like"}</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 rounded-full border-matrimony-200 hover:text-matrimony-700 hover:border-matrimony-300 dark:border-gray-700"
            onClick={handleMessage}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            <span>Message</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default LikedProfileCard;
