
import React from 'react';
import { motion } from 'framer-motion';
import { LikedProfile } from './hooks/useLikedProfiles';
import { AlertCircle } from 'lucide-react';
import { calculateAge } from '@/utils/profile-utils';
import LikedProfileCard from './LikedProfileCard';

interface LikedProfilesListProps {
  profiles: LikedProfile[];
  onProfileSelect: (profileId: string) => void;
}

const LikedProfilesList: React.FC<LikedProfilesListProps> = ({ profiles, onProfileSelect }) => {
  if (profiles.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-xl"
      >
        <AlertCircle className="mx-auto h-12 w-12 text-matrimony-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">No one has liked your profile yet</h3>
        <p className="text-matrimony-500 dark:text-matrimony-400">
          Keep updating your profile and checking back to see who's interested.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {profiles.map((profile) => {
        const age = profile.date_of_birth ? calculateAge(profile.date_of_birth) : null;
        const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ');
        
        return (
          <LikedProfileCard
            key={profile.id}
            profile={{
              id: profile.id,
              name: fullName || 'Anonymous',
              age: age || 0,
              occupation: profile.job || 'Not specified',
              imageUrl: profile.avatar_url || '/placeholder.svg',
              location: profile.location || 'Unknown location',
              interests: profile.interests || []
            }}
            onSelect={() => onProfileSelect(profile.id)}
          />
        );
      })}
    </motion.div>
  );
};

export default LikedProfilesList;
