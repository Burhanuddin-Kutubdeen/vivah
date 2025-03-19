import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedTransition from '@/components/AnimatedTransition';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import ProfileLoading from '@/components/profile/ProfileLoading';
import ProfileContent from '@/components/profile/ProfileContent';
import ProfileTabs from '@/components/profile/ProfileTabs';

const sampleMatches = [
  {
    id: '1',
    name: 'Anushka',
    age: 28,
    occupation: 'Software Engineer',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80',
    matchPercentage: 92,
    isNewMatch: true,
  },
  {
    id: '2',
    name: 'Priya',
    age: 27,
    occupation: 'Marketing Manager',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
    matchPercentage: 87,
    isNewMatch: false,
  },
  {
    id: '3',
    name: 'Maya',
    age: 29,
    occupation: 'UX Designer',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    matchPercentage: 84,
    isNewMatch: true,
  },
];

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

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }
        
        setProfileData(data);
      } catch (error) {
        console.error('Error in profile fetch:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);

  const handleEditProfile = () => {
    navigate('/profile-setup?edit=true');
  };

  if (loading) {
    return <ProfileLoading />;
  }

  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />

        <main className="pt-24 pb-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <ProfileContent 
                profileData={profileData} 
                user={user} 
                calculateAge={calculateAge}
                onEditProfile={handleEditProfile} 
              />

              <ProfileTabs matches={sampleMatches} />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default Profile;
