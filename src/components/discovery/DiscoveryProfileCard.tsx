
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface DiscoveryProfile {
  id: string;
  name: string;
  age: number;
  occupation: string;
  location: string;
  interests: string[];
  bio: string;
  imageUrl: string;
  isOnline: boolean;
  lastActive: string;
  religion?: string;
  civilStatus?: string;
  gender: string;
}

interface DiscoveryProfileCardProps {
  profile: DiscoveryProfile;
  direction: 'left' | 'right' | null;
}

const DiscoveryProfileCard: React.FC<DiscoveryProfileCardProps> = ({ profile, direction }) => {
  return (
    <motion.div
      key={profile.id}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        x: direction === 'left' ? -300 : direction === 'right' ? 300 : 0,
        rotate: direction === 'left' ? -10 : direction === 'right' ? 10 : 0
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="overflow-hidden border-0 shadow-lg rounded-3xl">
        <div className="relative h-96">
          <img 
            src={profile.imageUrl} 
            alt={profile.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 z-10">
            <div className={`flex items-center ${profile.isOnline ? 'bg-green-500' : 'bg-gray-500'} text-white text-xs font-medium px-2.5 py-1 rounded-full`}>
              <span className={`h-2 w-2 rounded-full ${profile.isOnline ? 'bg-green-200' : 'bg-gray-300'} mr-1.5`}></span>
              {profile.isOnline ? 'Online' : profile.lastActive}
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h2 className="text-2xl font-bold">{profile.name}, {profile.age}</h2>
            <p className="opacity-90 mb-1">{profile.occupation}</p>
            <p className="opacity-90">{profile.location}</p>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="mb-4 flex flex-wrap gap-2">
            {profile.interests.map((interest, index) => (
              <Badge 
                key={index} 
                variant="outline"
                className="bg-matrimony-50 text-matrimony-700 dark:bg-matrimony-900 dark:text-matrimony-300 border-matrimony-200 dark:border-matrimony-700"
              >
                {interest}
              </Badge>
            ))}
          </div>
          
          <p className="text-matrimony-600 dark:text-matrimony-300 mb-6">
            {profile.bio}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DiscoveryProfileCard;
