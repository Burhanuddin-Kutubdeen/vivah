
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, X } from 'lucide-react';

interface ProfileCardProps {
  profile: {
    id: string;
    name: string;
    age: number;
    occupation: string;
    location: string;
    interests: string[];
    bio: string;
    imageUrl: string;
  };
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden max-w-md w-full mx-auto"
    >
      <div className="relative h-96">
        <img 
          src={profile.imageUrl} 
          alt={profile.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h2 className="text-2xl font-bold">{profile.name}, {profile.age}</h2>
          <p className="opacity-90 mb-1">{profile.occupation}</p>
          <p className="opacity-90">{profile.location}</p>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {profile.interests.map((interest, index) => (
            <span 
              key={index} 
              className="px-3 py-1 bg-matrimony-100 dark:bg-matrimony-800 text-matrimony-700 dark:text-matrimony-200 text-sm rounded-full"
            >
              {interest}
            </span>
          ))}
        </div>

        <p className="text-matrimony-600 dark:text-matrimony-300 mb-6">
          {profile.bio}
        </p>

        <div className="grid grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full border-matrimony-200 hover:border-matrimony-300 hover:bg-matrimony-50 dark:border-gray-700 dark:hover:border-gray-600 h-12 w-12"
          >
            <X className="h-5 w-5 text-matrimony-600 dark:text-matrimony-300" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full border-matrimony-200 hover:border-matrimony-300 hover:bg-matrimony-50 dark:border-gray-700 dark:hover:border-gray-600 h-12 w-12"
          >
            <MessageCircle className="h-5 w-5 text-matrimony-600 dark:text-matrimony-300" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full border-matrimony-200 hover:border-secondary hover:bg-secondary/5 dark:border-gray-700 dark:hover:border-secondary h-12 w-12"
          >
            <Heart className="h-5 w-5 text-secondary" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
