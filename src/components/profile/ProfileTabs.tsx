
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MatchCard from '@/components/MatchCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { calculateAge } from '@/utils/profile-utils';

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
  matches?: Match[];
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ matches: initialMatches }) => {
  const [matches, setMatches] = useState<Match[]>(initialMatches || []);
  const [loading, setLoading] = useState(!initialMatches);
  const { user } = useAuth();

  useEffect(() => {
    // If matches were provided as props, use those instead of fetching
    if (initialMatches && initialMatches.length > 0) {
      setMatches(initialMatches);
      setLoading(false);
      return;
    }

    const fetchRealProfiles = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch profiles that are not the current user
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', user.id)
          .limit(6);
        
        if (error) {
          console.error('Error fetching profiles:', error);
          return;
        }
        
        if (data) {
          // Transform the data into the format needed for MatchCard
          const formattedMatches = data.map(profile => {
            const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ');
            const age = profile.date_of_birth ? calculateAge(profile.date_of_birth) : 30;
            
            return {
              id: profile.id,
              name: fullName || 'Anonymous',
              age: age,
              occupation: profile.job || 'Not specified',
              imageUrl: profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80',
              matchPercentage: Math.floor(Math.random() * 30) + 70, // Random match percentage between 70-99
              isNewMatch: Math.random() > 0.7 // Random new match status
            };
          });
          
          setMatches(formattedMatches);
        }
      } catch (err) {
        console.error('Error in profile fetch:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRealProfiles();
  }, [user, initialMatches]);

  return (
    <div className="mt-10">
      <Tabs defaultValue="matches" className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="matches" className="flex-1">Your Matches</TabsTrigger>
          <TabsTrigger value="activity" className="flex-1">Recent Activity</TabsTrigger>
          <TabsTrigger value="preferences" className="flex-1">Preferences</TabsTrigger>
        </TabsList>
        <TabsContent value="matches">
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-matrimony-500" />
            </div>
          ) : matches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
              <p className="text-matrimony-600 dark:text-matrimony-300">
                No matches found. Complete your profile to find better matches.
              </p>
            </div>
          )}
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
