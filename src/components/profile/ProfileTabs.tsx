
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MatchCard from '@/components/MatchCard';

interface Match {
  id: string;
  name: string;
  age: number;
  occupation: string;
  imageUrl: string;
  matchPercentage: number;
  isNewMatch: boolean;
}

interface ProfileTabsProps {
  matches: Match[];
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ matches }) => {
  return (
    <div className="mt-10">
      <Tabs defaultValue="matches" className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="matches" className="flex-1">Your Matches</TabsTrigger>
          <TabsTrigger value="activity" className="flex-1">Recent Activity</TabsTrigger>
          <TabsTrigger value="preferences" className="flex-1">Preferences</TabsTrigger>
        </TabsList>
        <TabsContent value="matches">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map(match => (
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
  );
};

export default ProfileTabs;
