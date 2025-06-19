
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const ProfileSetup: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to set up your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
          <h1 className="text-2xl font-bold mb-6">Complete Your Profile</h1>
          
          <div className="space-y-6">
            <p className="text-matrimony-600 dark:text-matrimony-400">
              Let's set up your profile to help you find better matches.
            </p>
            
            <Button 
              onClick={() => navigate('/profile/edit')}
              className="w-full"
            >
              Start Profile Setup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
