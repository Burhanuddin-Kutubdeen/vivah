
import { useState } from 'react';

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

export interface UseDiscoveryProfilesOptions {
  isPremium: boolean;
}

export function useDiscoveryProfiles({ isPremium }: UseDiscoveryProfilesOptions) {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [remainingLikes, setRemainingLikes] = useState(isPremium ? Infinity : 10);

  const currentProfile = discoveryProfiles[currentProfileIndex];

  const handleSwipe = (dir: 'left' | 'right') => {
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
    if (!isPremium) return;
    
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

  return {
    currentProfile,
    direction,
    remainingLikes,
    handleSwipe,
    handleSuperLike
  };
}
