
import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface ProfileInterestsProps {
  interests?: string[] | null;
}

const ProfileInterests: React.FC<ProfileInterestsProps> = ({ interests }) => {
  if (!interests || interests.length === 0) return null;

  return (
    <div className="mt-6">
      <h2 className="text-lg font-medium mb-3">Interests</h2>
      <div className="flex flex-wrap gap-2">
        {interests.map((interest, index) => (
          <Badge 
            key={index} 
            variant="outline"
            className="bg-matrimony-50 text-matrimony-700 dark:bg-matrimony-900 dark:text-matrimony-300 border-matrimony-200 dark:border-matrimony-700"
          >
            {interest}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ProfileInterests;
