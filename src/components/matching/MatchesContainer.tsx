
import React from 'react';
import { useMatches } from '@/hooks/use-matches';
import MatchCard from '@/components/matching/MatchCard';
import MatchFilters from '@/components/matching/MatchFilters';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const MatchesContainer: React.FC = () => {
  const { 
    matches, 
    curatedMatches, 
    isLoading, 
    error, 
    lastRefreshDate, 
    filters, 
    applyFilters, 
    refreshMatches 
  } = useMatches();

  const { toast } = useToast();

  const handleLike = (matchId: string) => {
    // In a real app, this would send a like notification or update the database
    toast({
      title: "Liked Profile",
      description: "You've liked this profile. We'll notify them!",
    });
  };

  const handleMessage = (matchId: string) => {
    // In a real app, this would redirect to a chat or create a new conversation
    toast({
      title: "Message Started",
      description: "You can now start chatting with this match!",
    });
  };

  // Format the refresh date
  const formattedDate = lastRefreshDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long', 
    year: 'numeric'
  });

  // Calculate days until next refresh (every 3 days)
  const daysUntilRefresh = () => {
    const threeDaysFromLastRefresh = new Date(lastRefreshDate);
    threeDaysFromLastRefresh.setDate(threeDaysFromLastRefresh.getDate() + 3);
    
    const now = new Date();
    const diffTime = Math.abs(threeDaysFromLastRefresh.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Matches</h1>
        <p className="text-matrimony-600 dark:text-matrimony-300">
          Discover people who share your interests and values
        </p>
      </div>

      <MatchFilters 
        filters={filters} 
        onApplyFilters={applyFilters} 
        isLoading={isLoading} 
      />

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}. Please try again later or contact support if the issue persists.
          </AlertDescription>
        </Alert>
      )}

      {/* Curated Matches Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Curated For You</h2>
          <div className="text-sm text-matrimony-600 dark:text-matrimony-300">
            Refreshes in: {daysUntilRefresh()} days
          </div>
        </div>
        
        <p className="text-sm text-matrimony-500 dark:text-matrimony-400 mb-4">
          Last refreshed: {formattedDate}
        </p>

        {isLoading && curatedMatches.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-matrimony-500" />
          </div>
        ) : curatedMatches.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {curatedMatches.map((match) => (
              <MatchCard 
                key={match.profile.id} 
                match={match} 
                onLike={handleLike}
                onMessage={handleMessage}
              />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-matrimony-600 dark:text-matrimony-300">
              No curated matches found. Update your profile to get better matches.
            </p>
          </div>
        )}
      </div>

      {/* All Matches Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">All Matches</h2>
        
        {isLoading && matches.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-matrimony-500" />
          </div>
        ) : matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {matches.map((match) => (
              <MatchCard 
                key={match.profile.id} 
                match={match} 
                onLike={handleLike}
                onMessage={handleMessage}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-matrimony-600 dark:text-matrimony-300">
              No matches found with current filters. Try adjusting your preferences.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchesContainer;
