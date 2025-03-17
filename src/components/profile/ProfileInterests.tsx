
import React from 'react';

interface ProfileInterestsProps {
  interests: string[] | null | undefined;
}

const ProfileInterests: React.FC<ProfileInterestsProps> = ({ interests }) => {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium mb-3">Interests</h2>
      <div className="flex flex-wrap gap-2">
        {interests && interests.length > 0 ? (
          interests.map((interest, index) => (
            <span 
              key={index} 
              className="px-3 py-1 bg-matrimony-100 dark:bg-matrimony-800 text-matrimony-700 dark:text-matrimony-200 rounded-full text-sm"
            >
              {interest}
            </span>
          ))
        ) : (
          <p className="text-matrimony-400">No interests specified</p>
        )}
      </div>
    </div>
  );
};

export default ProfileInterests;
