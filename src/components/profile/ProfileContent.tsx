
import React from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileAbout from './ProfileAbout';
import ProfileInterests from './ProfileInterests';
import ProfileContact from './ProfileContact';
import ProfileDetails from './ProfileDetails';

interface ProfileData {
  first_name?: string | null;
  last_name?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  civil_status?: string | null;
  religion?: string | null;
  location?: string | null;
  bio?: string | null;
  interests?: string[] | null;
  avatar_url?: string | null;
  height?: number | null;
  weight?: number | null;
  education?: string | null;
  job?: string | null;
  exercise?: string | null;
  drinking?: string | null;
  smoking?: string | null;
  wants_kids?: string | null;
  has_kids?: string | null;
}

interface ProfileContentProps {
  profileData: ProfileData | null;
  user: any;
  calculateAge: (dateOfBirth: string) => number;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ profileData, user, calculateAge }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <ProfileHeader 
        profileData={profileData} 
        user={user} 
        calculateAge={calculateAge} 
      />
      <div className="px-8 pb-8">
        <ProfileAbout bio={profileData?.bio} />
        <ProfileDetails profileData={profileData} />
        <ProfileInterests interests={profileData?.interests} />
        <ProfileContact email={user?.email} />
      </div>
    </div>
  );
};

export default ProfileContent;
