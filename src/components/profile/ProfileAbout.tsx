
import React from 'react';

interface ProfileAboutProps {
  bio: string | null | undefined;
}

const ProfileAbout: React.FC<ProfileAboutProps> = ({ bio }) => {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium mb-3">About Me</h2>
      <p className="text-matrimony-600 dark:text-matrimony-300">
        {bio || 'No bio information available.'}
      </p>
    </div>
  );
};

export default ProfileAbout;
