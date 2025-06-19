
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/use-profile';
import ProfileLoading from './ProfileLoading';

const ProfileTabs: React.FC = () => {
  const { user } = useAuth();
  const { profile, isLoading } = useProfile(undefined, user);

  const calculateAge = (dateOfBirth: string): number => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  if (isLoading) {
    return <ProfileLoading />;
  }

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your basic profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                <p className="mt-1">{profile?.first_name} {profile?.last_name}</p>
              </div>
              {profile?.date_of_birth && (
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Age</label>
                  <p className="mt-1">{calculateAge(profile.date_of_birth)} years old</p>
                </div>
              )}
              {profile?.location && (
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</label>
                  <p className="mt-1">{profile.location}</p>
                </div>
              )}
              {profile?.job && (
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Profession</label>
                  <p className="mt-1">{profile.job}</p>
                </div>
              )}
            </div>
            {profile?.bio && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">About</label>
                <p className="mt-1 text-gray-700 dark:text-gray-300">{profile.bio}</p>
              </div>
            )}
            {profile?.interests && profile.interests.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Interests</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary">{interest}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="preferences" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Match Preferences</CardTitle>
            <CardDescription>Your dating preferences and criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 dark:text-gray-400">Preferences settings coming soon...</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="activity" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent matches and interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 dark:text-gray-400">Activity history coming soon...</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
