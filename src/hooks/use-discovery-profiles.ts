
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
    lastActive: '2 min ago'
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
    lastActive: '1 hour ago'
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
    lastActive: 'Just now'
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
    lastActive: '3 hours ago'
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
    lastActive: '5 min ago'
  }
];

export interface UseDiscoveryProfilesOptions {
  isPremium: boolean;
  preferences?: {
    interests: string[];
    ageRange: [number, number];
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
      // Get user's profile (if available)
      const userGender = user?.gender || 'male'; // Default if not available
      
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
      
      // 3. If interests are selected, score and sort by matching interests
      if (preferences?.interests && preferences.interests.length > 0) {
        // Calculate interest match score for each profile
        matchedProfiles = matchedProfiles.map(profile => {
          const sharedInterests = preferences.interests.filter(interest => 
            profile.interests.includes(interest)
          );
          
          const score = sharedInterests.length;
          
          return {
            ...profile,
            matchScore: score
          };
        })
        // Sort by match score (highest first)
        .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
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
