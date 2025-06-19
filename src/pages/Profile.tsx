
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Edit } from 'lucide-react';
import ProfileTabs from '@/components/profile/ProfileTabs';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">My Profile</h1>
            <Button onClick={() => navigate('/profile/edit')}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
          
          <div className="flex items-center space-x-6">
            <img 
              src="https://via.placeholder.com/120" 
              alt="Profile" 
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-medium">Your Name</h2>
              <p className="text-matrimony-600 dark:text-matrimony-400">Your bio will appear here</p>
            </div>
          </div>
        </div>

        <ProfileTabs />
      </div>
    </div>
  );
};

export default Profile;
