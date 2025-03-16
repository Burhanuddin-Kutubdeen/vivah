
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Star, User, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Sample discovery profiles
const discoveryProfiles = [
  {
    id: '1',
    name: 'Anushka',
    age: 28,
    occupation: 'Software Engineer',
    location: 'Colombo, Sri Lanka',
    interests: ['Reading', 'Traveling', 'Cooking'],
    bio: 'Software engineer who loves to explore new cultures through food and travel. Looking for someone who shares my passion for learning and adventures.',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80',
    isOnline: true,
    lastActive: '2 min ago'
  },
  {
    id: '2',
    name: 'Raj',
    age: 32,
    occupation: 'Doctor',
    location: 'Kandy, Sri Lanka',
    interests: ['Fitness', 'Music', 'Photography'],
    bio: 'Doctor by profession, photographer by passion. I believe in maintaining a healthy lifestyle and finding beauty in everyday moments.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
    isOnline: false,
    lastActive: '1 hour ago'
  },
  {
    id: '3',
    name: 'Priya',
    age: 27,
    occupation: 'Marketing Manager',
    location: 'Galle, Sri Lanka',
    interests: ['Dancing', 'Painting', 'Yoga'],
    bio: 'Creative soul with a passion for arts and wellness. Looking for someone who appreciates life\'s simple pleasures and values personal growth.',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
    isOnline: true,
    lastActive: 'Just now'
  }
];

interface SwipeDiscoveryProps {
  isOffline: boolean;
  isPremium?: boolean;
  isLoading?: boolean;
}

const SwipeDiscovery: React.FC<SwipeDiscoveryProps> = ({ isOffline, isPremium = false, isLoading = false }) => {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [remainingLikes, setRemainingLikes] = useState(isPremium ? Infinity : 10);

  const currentProfile = discoveryProfiles[currentProfileIndex];

  const handleSwipe = (dir: 'left' | 'right') => {
    if (isOffline) return;
    
    setDirection(dir);
    
    // If swiping right (like) and not premium, reduce remaining likes
    if (dir === 'right' && !isPremium) {
      setRemainingLikes(prev => Math.max(0, prev - 1));
    }
    
    // Wait for animation to complete before changing the profile
    setTimeout(() => {
      if (currentProfileIndex < discoveryProfiles.length - 1) {
        setCurrentProfileIndex(prev => prev + 1);
      } else {
        setCurrentProfileIndex(0); // Loop back to the first profile
      }
      setDirection(null);
    }, 300);
  };

  const handleSuperLike = () => {
    if (isOffline || !isPremium) return;
    
    // Logic for super like
    console.log('Super liked:', currentProfile.name);
    
    // Move to next profile
    setTimeout(() => {
      if (currentProfileIndex < discoveryProfiles.length - 1) {
        setCurrentProfileIndex(prev => prev + 1);
      } else {
        setCurrentProfileIndex(0);
      }
    }, 300);
  };

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-40" />
        </div>
        
        <div className="flex flex-col items-center">
          <Skeleton className="h-[500px] w-full max-w-md mb-6 rounded-3xl" />
          
          <div className="flex items-center justify-center space-x-4 mt-6">
            <Skeleton className="h-14 w-14 rounded-full" />
            <Skeleton className="h-14 w-14 rounded-full" />
            <Skeleton className="h-14 w-14 rounded-full" />
          </div>
          
          <Skeleton className="h-8 w-64 mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Discovery Mode</h2>
        <div className="flex items-center space-x-2">
          {!isPremium && (
            <span className="text-sm text-matrimony-600 dark:text-matrimony-300">
              {remainingLikes} likes remaining today
            </span>
          )}
        </div>
      </div>
      
      <div className="flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProfile.id}
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
                  src={currentProfile.imageUrl} 
                  alt={currentProfile.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 z-10">
                  <div className={`flex items-center ${currentProfile.isOnline ? 'bg-green-500' : 'bg-gray-500'} text-white text-xs font-medium px-2.5 py-1 rounded-full`}>
                    <span className={`h-2 w-2 rounded-full ${currentProfile.isOnline ? 'bg-green-200' : 'bg-gray-300'} mr-1.5`}></span>
                    {currentProfile.isOnline ? 'Online' : currentProfile.lastActive}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h2 className="text-2xl font-bold">{currentProfile.name}, {currentProfile.age}</h2>
                  <p className="opacity-90 mb-1">{currentProfile.occupation}</p>
                  <p className="opacity-90">{currentProfile.location}</p>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="mb-4 flex flex-wrap gap-2">
                  {currentProfile.interests.map((interest, index) => (
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
                  {currentProfile.bio}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
        
        <div className="flex items-center justify-center space-x-4 mt-6">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-14 w-14 rounded-full border-matrimony-200 hover:border-red-400 hover:bg-red-50 dark:border-gray-700 dark:hover:border-red-400 dark:hover:bg-gray-800"
            onClick={() => handleSwipe('left')}
            disabled={isOffline}
          >
            <X className="h-6 w-6 text-red-500" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className={cn(
              "h-14 w-14 rounded-full border-matrimony-200 hover:border-blue-400 hover:bg-blue-50 dark:border-gray-700 dark:hover:border-blue-400 dark:hover:bg-gray-800",
              !isPremium && "opacity-50 cursor-not-allowed"
            )}
            onClick={handleSuperLike}
            disabled={isOffline || !isPremium}
          >
            <Star className="h-6 w-6 text-blue-500" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className={cn(
              "h-14 w-14 rounded-full border-matrimony-200 hover:border-green-400 hover:bg-green-50 dark:border-gray-700 dark:hover:border-green-400 dark:hover:bg-gray-800",
              !isPremium && remainingLikes <= 0 && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => handleSwipe('right')}
            disabled={isOffline || (!isPremium && remainingLikes <= 0)}
          >
            <Heart className="h-6 w-6 text-green-500" />
          </Button>
        </div>
        
        {!isPremium && (
          <div className="mt-4 text-center">
            <Button 
              variant="secondary" 
              size="sm" 
              className="rounded-full text-xs"
              disabled={isOffline}
            >
              Upgrade to Premium for Unlimited Likes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwipeDiscovery;
