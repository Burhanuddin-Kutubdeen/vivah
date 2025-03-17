
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Sample discovery profiles
const discoveryProfiles = [
  {
    id: '1',
    name: 'Anushka',
    age: 28,
    gender: 'female',
    occupation: 'Software Engineer',
    location: 'Colombo, Sri Lanka',
    interests: ['Reading', 'Traveling', 'Cooking', 'Technology'],
    bio: 'Software engineer who loves to explore new cultures through food and travel. Looking for someone who shares my passion for learning and adventures.',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80',
    isOnline: true,
    lastActive: '2 min ago',
    religion: 'hindu',
    civilStatus: 'single'
  },
  {
    id: '2',
    name: 'Raj',
    age: 32,
    gender: 'male',
    occupation: 'Doctor',
    location: 'Kandy, Sri Lanka',
    interests: ['Fitness', 'Music', 'Photography', 'Science'],
    bio: 'Doctor by profession, photographer by passion. I believe in maintaining a healthy lifestyle and finding beauty in everyday moments.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
    isOnline: false,
    lastActive: '1 hour ago',
    religion: 'christian',
    civilStatus: 'single'
  },
  {
    id: '3',
    name: 'Priya',
    age: 27,
    gender: 'female',
    occupation: 'Marketing Manager',
    location: 'Galle, Sri Lanka',
    interests: ['Dancing', 'Painting', 'Yoga', 'Music'],
    bio: 'Creative soul with a passion for arts and wellness. Looking for someone who appreciates life\'s simple pleasures and values personal growth.',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
    isOnline: true,
    lastActive: 'Just now',
    religion: 'hindu',
    civilStatus: 'single'
  },
  {
    id: '4',
    name: 'Arun',
    age: 30,
    gender: 'male',
    occupation: 'Financial Analyst',
    location: 'Colombo, Sri Lanka',
    interests: ['Hiking', 'Reading', 'Travel', 'Photography'],
    bio: 'Finance professional with a love for the outdoors. Seeking a partner to share adventures and quiet moments alike.',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
    isOnline: false,
    lastActive: '3 hours ago',
    religion: 'muslim',
    civilStatus: 'divorced'
  },
  {
    id: '5',
    name: 'Divya',
    age: 26,
    gender: 'female',
    occupation: 'UX Designer',
    location: 'Negombo, Sri Lanka',
    interests: ['Art', 'Movies', 'Technology', 'Fashion'],
    bio: 'Creative designer who believes in the power of good design to transform lives. Looking for someone who appreciates aesthetics and thoughtful conversation.',
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80',
    isOnline: true,
    lastActive: '5 min ago',
    religion: 'buddhist',
    civilStatus: 'single'
  }
];

// Let's also update the DiscoveryProfile interface in DiscoveryProfileCard.tsx to include these properties
export interface UseDiscoveryProfilesOptions {
  isPremium: boolean;
  preferences?: {
    ageRange: [number, number];
    religion?: string;
    civilStatus?: string;
  };
}

export function useDiscoveryProfiles({ isPremium, preferences }: UseDiscoveryProfilesOptions) {
  const [filteredProfiles, setFilteredProfiles] = useState(discoveryProfiles);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [remainingLikes, setRemainingLikes] = useState(isPremium ? Infinity : 10);
  const { user } = useAuth();

  // Filter and sort profiles based on preferences and heterosexual matching
  useEffect(() => {
    const applyMatchmaking = () => {
      // Since user.gender is not available directly, we extract it from auth context
      // In a real app, this would come from the user's profile data
      
      // For demo purposes, assume male unless we have explicit gender information
      // This is a common approach for matchmaking systems
      let userGender = 'male'; // Default if not available
      
      // Check if user metadata or profile data is available with gender information
      if (user) {
        // First try to get gender from user metadata
        const metadata = user.user_metadata;
        if (metadata && metadata.gender) {
          userGender = metadata.gender;
        }
        // If not in metadata, try to get it from app_metadata
        else if (user.app_metadata && user.app_metadata.gender) {
          userGender = user.app_metadata.gender;
        }
      }
      
      // 1. Filter by gender for heterosexual matching
      let matchedProfiles = [...discoveryProfiles].filter(profile => {
        if (userGender === 'male') return profile.gender === 'female';
        if (userGender === 'female') return profile.gender === 'male';
        return true; // Fallback if gender not specified
      });
      
      // 2. Apply age filter if available
      if (preferences?.ageRange) {
        const [minAge, maxAge] = preferences.ageRange;
        matchedProfiles = matchedProfiles.filter(
          profile => profile.age >= minAge && profile.age <= maxAge
        );
      }
      
      // 3. Apply religion filter if available
      if (preferences?.religion && preferences.religion !== '') {
        matchedProfiles = matchedProfiles.filter(
          profile => profile.religion === preferences.religion
        );
      }
      
      // 4. Apply civil status filter if available
      if (preferences?.civilStatus && preferences.civilStatus !== '') {
        matchedProfiles = matchedProfiles.filter(
          profile => profile.civilStatus === preferences.civilStatus
        );
      }
      
      setFilteredProfiles(matchedProfiles);
      setCurrentProfileIndex(0); // Reset to first profile after filtering
    };
    
    applyMatchmaking();
  }, [preferences, user]);

  // Current profile to display
  const currentProfile = filteredProfiles[currentProfileIndex] || null;

  const handleSwipe = (dir: 'left' | 'right') => {
    setDirection(dir);
    
    // If swiping right (like) and not premium, reduce remaining likes
    if (dir === 'right' && !isPremium) {
      setRemainingLikes(prev => Math.max(0, prev - 1));
    }
    
    // Wait for animation to complete before changing the profile
    setTimeout(() => {
      if (currentProfileIndex < filteredProfiles.length - 1) {
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
    console.log('Super liked:', currentProfile?.name);
    
    // Move to next profile
    setTimeout(() => {
      if (currentProfileIndex < filteredProfiles.length - 1) {
        setCurrentProfileIndex(prev => prev + 1);
      } else {
        setCurrentProfileIndex(0);
      }
    }, 300);
  };
  
  // Function to apply new preferences directly
  const applyPreferences = (newPreferences: typeof preferences) => {
    // The effect will handle the actual filtering
    console.log('Applying preferences:', newPreferences);
  };

  return {
    currentProfile,
    direction,
    remainingLikes,
    handleSwipe,
    handleSuperLike,
    applyPreferences
  };
}
