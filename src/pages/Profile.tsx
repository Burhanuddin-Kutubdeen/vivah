
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Camera, Edit, Mail, MapPin, Phone, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MatchCard from '@/components/MatchCard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";

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

// Define the profile data structure
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
}

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Calculate age from date of birth
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

  // Fetch user profile data
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

  if (loading) {
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
  }

  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />

        <main className="pt-24 pb-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
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
                        {profileData?.first_name || user?.email?.split('@')[0] || 'User'}
                        {profileData?.date_of_birth && `, ${calculateAge(profileData.date_of_birth)}`}
                      </h1>
                      <p className="text-matrimony-600 dark:text-matrimony-300 flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {profileData?.location || 'No location set'}
                      </p>
                      <p className="text-matrimony-600 dark:text-matrimony-300 mt-1">
                        {profileData?.civil_status && `${profileData.civil_status.charAt(0).toUpperCase() + profileData.civil_status.slice(1)}`}
                        {profileData?.religion && ` • ${profileData.religion.charAt(0).toUpperCase() + profileData.religion.slice(1)}`}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="rounded-full border-matrimony-200 hover:border-matrimony-300"
                      onClick={() => window.location.href = '/profile-setup'}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-lg font-medium mb-3">About Me</h2>
                    <p className="text-matrimony-600 dark:text-matrimony-300">
                      {profileData?.bio || 'No bio information available.'}
                    </p>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-lg font-medium mb-3">Interests</h2>
                    <div className="flex flex-wrap gap-2">
                      {profileData?.interests && profileData.interests.length > 0 ? (
                        profileData.interests.map((interest, index) => (
                          <span 
                            key={index} 
                            className="px-3 py-1 bg-matrimony-100 dark:bg-matrimony-800 text-matrimony-700 dark:text-matrimony-200 rounded-full text-sm"
                          >
                            {interest}
                          </span>
                        ))
                      ) : (
                        <p className="text-matrimony-400">No interests specified</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-lg font-medium mb-3">Contact Information</h2>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-matrimony-500 mr-3" />
                        <span>{user?.email || 'Email not available'}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-matrimony-500 mr-3" />
                        <span>Phone number not set</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Matches & Activity Tabs */}
              <div className="mt-10">
                <Tabs defaultValue="matches" className="w-full">
                  <TabsList className="w-full mb-6">
                    <TabsTrigger value="matches" className="flex-1">Your Matches</TabsTrigger>
                    <TabsTrigger value="activity" className="flex-1">Recent Activity</TabsTrigger>
                    <TabsTrigger value="preferences" className="flex-1">Preferences</TabsTrigger>
                  </TabsList>
                  <TabsContent value="matches">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sampleMatches.map(match => (
                        <MatchCard key={match.id} match={match} />
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="activity">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
                      <p className="text-matrimony-600 dark:text-matrimony-300">
                        Your recent activity will appear here.
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="preferences">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
                      <p className="text-matrimony-600 dark:text-matrimony-300">
                        Your matching preferences will appear here.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default Profile;
