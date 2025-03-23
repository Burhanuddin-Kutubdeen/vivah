
import React from 'react';
import { Button } from "@/components/ui/button";
import { Camera, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileHeaderProps {
  profileData: any;
  user: any;
  calculateAge: (dateOfBirth: string) => number;
  onEditProfile?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  profileData, 
  user,
  calculateAge,
  onEditProfile
}) => {
  const navigate = useNavigate();
  
  const handleEditProfile = () => {
    console.log("Edit profile button clicked");
    if (onEditProfile) {
      onEditProfile();
    } else {
      // Force navigation to profile setup with edit parameter
      navigate('/profile-setup?edit=true', { replace: true });
    }
  };

  // Create a display name using only the profile data first_name and last_name
  const firstName = profileData?.first_name || '';
  const lastName = profileData?.last_name || '';
  const displayName = [firstName, lastName].filter(Boolean).join(' ').trim() || 'User';

  return (
    <>
      {/* Profile Header */}
      <div className="relative h-56 md:h-72 bg-matrimony-600">
        <Button 
          variant="secondary" 
          size="sm" 
          className="absolute top-4 right-4 rounded-full"
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit Cover
        </Button>
        
        <div className="absolute -bottom-16 left-8 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden w-32 h-32">
          <img 
            src={profileData?.avatar_url || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
          <button className="absolute bottom-0 inset-x-0 bg-black bg-opacity-50 text-white text-xs py-1 flex items-center justify-center">
            <Camera className="h-3 w-3 mr-1" />
            Change
          </button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-20 px-8 pb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">
              {displayName}
              {profileData?.date_of_birth && `, ${calculateAge(profileData.date_of_birth)}`}
            </h1>
            <p className="text-matrimony-600 dark:text-matrimony-300 flex items-center mt-1">
              <span className="inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {profileData?.location || 'No location set'}
              </span>
            </p>
            <p className="text-matrimony-600 dark:text-matrimony-300 mt-1">
              {profileData?.civil_status && `${profileData.civil_status.charAt(0).toUpperCase() + profileData.civil_status.slice(1).replace(/_/g, ' ')}`}
              {profileData?.religion && ` • ${profileData.religion.charAt(0).toUpperCase() + profileData.religion.slice(1).replace(/_/g, ' ')}`}
            </p>
          </div>
          <Button 
            variant="outline" 
            className="rounded-full border-matrimony-200 hover:border-matrimony-300"
            onClick={handleEditProfile}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;
