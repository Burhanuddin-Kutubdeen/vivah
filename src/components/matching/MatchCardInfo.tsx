
import React, { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { api } from '@/services/api';
import { isValidUUID } from '@/utils/validation';

interface MatchCardInfoProps {
  name: string;
  age: number;
  location?: string;
  sharedInterests?: string[];
  profileId?: string;
}

const MatchCardInfo: React.FC<MatchCardInfoProps> = ({
  name,
  age,
  location,
  sharedInterests = [],
  profileId
}) => {
  const [displayName, setDisplayName] = useState<string>(name);
  
  useEffect(() => {
    const fetchProfileName = async () => {
      if (!profileId || !isValidUUID(profileId)) return;
      
      try {
        const data = await api.profiles.get(profileId);
        
        if (!data) return;
        
        const firstName = data.first_name || '';
        const lastName = data.last_name || '';
        const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
        
        if (fullName) {
          setDisplayName(fullName);
        }
      } catch (err) {
        console.error('Error fetching profile name:', err);
      }
    };
    
    fetchProfileName();
  }, [profileId]);

  return (
    <div className="p-4">
      <h3 className="font-medium text-lg">{displayName}, {age}</h3>
      <p className="text-sm text-matrimony-600 dark:text-matrimony-400 mb-2">{location || 'Location not specified'}</p>
      
      {sharedInterests.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-matrimony-500 mb-1">Shared Interests:</p>
          <div className="flex flex-wrap gap-1">
            {sharedInterests.slice(0, 3).map((interest, index) => (
              <Badge 
                key={index} 
                variant="secondary"
                className="text-xs"
              >
                {interest}
              </Badge>
            ))}
            {sharedInterests.length > 3 && (
              <Badge 
                variant="outline"
                className="text-xs"
              >
                +{sharedInterests.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchCardInfo;
