
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';

export const useDiscoveryProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [remainingLikes, setRemainingLikes] = useState(10); // Default daily likes
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!user) return;
      
      try {
        const data = await api.profiles.getMatches();
        setProfiles(data || []);
      } catch (err) {
        console.error('Error fetching discovery profiles:', err);
        setError('Failed to load profiles');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, [user]);

  const currentProfile = profiles[currentProfileIndex] || null;
  const hasProfiles = profiles.length > 0;

  const handleSwipe = (swipeDirection: 'left' | 'right') => {
    setDirection(swipeDirection);
    
    // Move to next profile after a short delay
    setTimeout(() => {
      if (currentProfileIndex < profiles.length - 1) {
        setCurrentProfileIndex(prev => prev + 1);
      }
      setDirection(null);
      
      // Decrease remaining likes if it's a right swipe (like)
      if (swipeDirection === 'right') {
        setRemainingLikes(prev => Math.max(0, prev - 1));
      }
    }, 300);
  };

  const handleSuperLike = () => {
    // Similar to regular like but with super like logic
    handleSwipe('right');
  };

  const applyPreferences = (preferences: any) => {
    // This would filter profiles based on preferences
    // For now, we'll just log the preferences
    console.log('Applying preferences:', preferences);
  };

  return {
    profiles,
    isLoading,
    error,
    currentProfile,
    direction,
    remainingLikes,
    handleSwipe,
    handleSuperLike,
    applyPreferences,
    hasProfiles
  };
};
