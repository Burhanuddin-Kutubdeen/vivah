
import React from 'react';

interface ProfileDetailProps {
  label: string;
  value: string | null | undefined;
}

export const ProfileDetail: React.FC<ProfileDetailProps> = ({ label, value }) => {
  if (!value) return null;
  
  return (
    <div className="flex justify-between">
      <span className="text-sm text-matrimony-500 dark:text-matrimony-400">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
};
