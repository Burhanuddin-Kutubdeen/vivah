
import React from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileAbout from './ProfileAbout';
import ProfileInterests from './ProfileInterests';
import ProfileDetails from './ProfileDetails';
import ProfileAdmirers from './ProfileAdmirers';

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
  onEditProfile?: () => void;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ 
  profileData, 
  user, 
  calculateAge,
  onEditProfile 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <ProfileHeader 
        profileData={profileData} 
        user={user} 
        calculateAge={calculateAge}
        onEditProfile={onEditProfile}
      />
      <div className="px-8 pb-8">
        <ProfileAbout bio={profileData?.bio} />
        <ProfileDetails profileData={profileData} />
        <ProfileInterests interests={profileData?.interests} />
        <ProfileAdmirers calculateAge={calculateAge} />
      </div>
    </div>
  );
};

export default ProfileContent;
