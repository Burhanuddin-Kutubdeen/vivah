
import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

interface MatchCardProps {
  match: {
    id: string;
    name: string;
    age: number;
    occupation: string;
    imageUrl: string;
    matchPercentage: number;
    isNewMatch: boolean;
  };
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
    >
      <div className="relative">
        {match.isNewMatch && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-secondary text-white text-xs font-medium px-2.5 py-1 rounded-full">
              New Match
            </span>
          </div>
        )}
        <div className="h-56 overflow-hidden">
          <img 
            src={match.imageUrl} 
            alt={match.name} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <div className="absolute bottom-3 right-3 bg-white dark:bg-gray-900 rounded-full px-2 py-1 text-xs font-medium text-matrimony-700 dark:text-matrimony-300 shadow-sm">
          {match.matchPercentage}% Match
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-lg">{match.name}, {match.age}</h3>
        <p className="text-sm text-matrimony-600 dark:text-matrimony-400 mb-4">{match.occupation}</p>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 rounded-full border-matrimony-200 hover:text-secondary hover:border-secondary dark:border-gray-700"
          >
            <Heart className="h-4 w-4 mr-1" />
            <span>Like</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 rounded-full border-matrimony-200 hover:text-matrimony-700 hover:border-matrimony-300 dark:border-gray-700"
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            <span>Message</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default MatchCard;
