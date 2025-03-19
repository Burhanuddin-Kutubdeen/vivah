
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MatchCard from '@/components/MatchCard';
import { Button } from "@/components/ui/button";
import { Star } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from '@/contexts/AuthContext';

// Sample curated matches data - would be fetched from API in production
const allMatches = [
  {
    id: '1',
    name: 'Anushka',
    age: 28,
    occupation: 'Software Engineer',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80',
    matchPercentage: 95,
    isNewMatch: true,
    interests: ["Technology", "Reading", "Travel", "Music"]
  },
  {
    id: '2',
    name: 'Raj',
    age: 32,
    occupation: 'Doctor',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
    matchPercentage: 88,
    isNewMatch: false,
    interests: ["Fitness", "Travel", "Art", "Cooking"]
  },
  {
    id: '3',
    name: 'Priya',
    age: 27,
    occupation: 'Marketing Manager',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
    matchPercentage: 92,
    isNewMatch: true,
    interests: ["Photography", "Travel", "Music", "Dancing"]
  },
  {
    id: '4',
    name: 'Aditya',
    age: 30,
    occupation: 'Architect',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
    matchPercentage: 85,
    isNewMatch: false,
    interests: ["Art", "Design", "Architecture", "History"]
  },
  {
    id: '5',
    name: 'Maya',
    age: 26,
    occupation: 'Teacher',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    matchPercentage: 78,
    isNewMatch: true,
    interests: ["Reading", "Education", "Writing", "Music"]
  },
  {
    id: '6',
    name: 'Vikram',
    age: 33,
    occupation: 'Financial Analyst',
    imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1248&q=80',
    matchPercentage: 82,
    isNewMatch: false,
    interests: ["Finance", "Technology", "Travel", "Sports"]
  }
];

interface CuratedMatchesGridProps {
  isOffline: boolean;
  isLoading?: boolean;
}

const CuratedMatchesGrid: React.FC<CuratedMatchesGridProps> = ({ isOffline, isLoading = false }) => {
  const { user } = useAuth();
  const [recommendedMatches, setRecommendedMatches] = useState(allMatches);
  
  useEffect(() => {
    // We'll check if the user has any interests stored in their metadata or profile
    const userInterests = user?.user_metadata?.interests || 
                          user?.user_metadata?.profile?.interests || 
                          [];
    
    if (userInterests && userInterests.length > 0) {
      // Sort profiles by shared interests if user has interests
      const sortedMatches = [...allMatches].sort((a, b) => {
        const aInterests = a.interests.filter(interest => 
          userInterests.includes(interest)).length;
        const bInterests = b.interests.filter(interest => 
          userInterests.includes(interest)).length;
        return bInterests - aInterests; // Descending order
      });
      
      // Take the top 4 matches
      setRecommendedMatches(sortedMatches.slice(0, 4));
    }
  }, [user]);
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const lastRefreshDate = new Date();
  // Format the date to show day, month name, and year
  const formattedDate = lastRefreshDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long', 
    year: 'numeric'
  });

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-32" />
        </div>
        
        <Skeleton className="h-5 w-64 mb-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-72 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">For You</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-matrimony-600 dark:text-matrimony-300">
            Refreshes in: 3 days
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full border-matrimony-200 hover:border-matrimony-300 hover:bg-matrimony-50 dark:border-gray-700"
            disabled={isOffline}
          >
            <Star size={16} className="mr-1" />
            View All
          </Button>
        </div>
      </div>
      
      <p className="text-sm text-matrimony-500 dark:text-matrimony-400 mb-4">
        Last refreshed: {formattedDate} • Sorted by shared interests
      </p>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {recommendedMatches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </motion.div>
    </div>
  );
};

export default CuratedMatchesGrid;
