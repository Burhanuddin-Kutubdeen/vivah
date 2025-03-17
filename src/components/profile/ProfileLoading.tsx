
import React from 'react';
import { Loader2 } from 'lucide-react';
import AnimatedTransition from '@/components/AnimatedTransition';

const ProfileLoading: React.FC = () => {
  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-matrimony-500" />
          <p className="mt-4 text-matrimony-600">Loading your profile...</p>
        </div>
      </div>
    </AnimatedTransition>
  );
};

export default ProfileLoading;
