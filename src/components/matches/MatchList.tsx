
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MatchCard from '@/components/MatchCard';
import MatchCardActions from './MatchCardActions';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Match {
  id: string;
  name: string;
  age: number;
  occupation: string;
  imageUrl: string;
  matchPercentage: number;
  isNewMatch: boolean;
  interests: string[];
}

interface MatchListProps {
  matches: Match[];
}

const MatchList: React.FC<MatchListProps> = ({ matches }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleViewProfile = (profileId: string, name: string) => {
    // Track profile views for analytics
    console.log(`Viewing profile: ${name} (${profileId})`);
    
    // Navigate to profile page
    navigate(`/profile/${profileId}`);
    
    // Optional toast notification
    toast({
      title: "Viewing Profile",
      description: `You're viewing ${name}'s profile`,
    });
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <>
      {matches.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-xl"
        >
          <AlertCircle className="mx-auto h-12 w-12 text-matrimony-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No matches found</h3>
          <p className="text-matrimony-500 dark:text-matrimony-400">
            Try adjusting your preferences or check back later for new matches.
          </p>
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {matches.map((match) => (
              <motion.div 
                key={match.id} 
                className="relative"
                variants={item}
                whileHover={{ 
                  y: -5, 
                  transition: { duration: 0.2 } 
                }}
              >
                <div 
                  onClick={() => handleViewProfile(match.id, match.name)} 
                  className="cursor-pointer transform transition-transform duration-200"
                >
                  <MatchCard match={match} />
                </div>
                <MatchCardActions profileId={match.id} name={match.name} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
};

export default MatchList;
