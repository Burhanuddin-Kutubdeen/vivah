
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedTransition from '@/components/AnimatedTransition';
import LikedProfilesContainer from '@/components/likedprofiles/LikedProfilesContainer';
import ProfilePopup from '@/components/profiles/ProfilePopup';
import { useAuth } from '@/contexts/AuthContext';

const LikedYou = () => {
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const { user } = useAuth();

  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-gradient-to-b from-white to-matrimony-50 dark:from-gray-900 dark:to-gray-800">
        <Navbar />

        <main className="pt-24 pb-16 px-4">
          <LikedProfilesContainer 
            onProfileSelect={setSelectedProfileId} 
          />

          {selectedProfileId && (
            <ProfilePopup
              profileId={selectedProfileId}
              onClose={() => setSelectedProfileId(null)}
            />
          )}
        </main>

        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default LikedYou;
