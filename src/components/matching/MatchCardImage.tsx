
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";

interface MatchCardImageProps {
  imageUrl: string;
  name: string;
  isNewMatch: boolean;
  matchPercentage: number;
}

const MatchCardImage: React.FC<MatchCardImageProps> = ({
  imageUrl,
  name,
  isNewMatch,
  matchPercentage
}) => {
  return (
    <div className="relative">
      {isNewMatch && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-secondary text-white text-xs font-medium px-2.5 py-1 rounded-full">
            New Match
          </span>
        </div>
      )}
      <div className="h-56 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="absolute bottom-3 right-3 bg-white dark:bg-gray-900 rounded-full px-2 py-1 text-xs font-medium text-matrimony-700 dark:text-matrimony-300 shadow-sm">
        {matchPercentage}% Match
      </div>
    </div>
  );
};

export default MatchCardImage;
