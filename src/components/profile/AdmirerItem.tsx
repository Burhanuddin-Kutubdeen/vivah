import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Admirer } from './hooks/useAdmirers';
import { isValidUUID } from '@/utils/validation';

interface AdmirerItemProps {
  admirer: Admirer;
  age: number | null;
  onViewProfile: (id: string) => void;
  onMessage: (id: string, name: string) => void;
}

const AdmirerItem: React.FC<AdmirerItemProps> = ({ 
  admirer, 
  age, 
  onViewProfile, 
  onMessage 
}) => {
  const fullName = `${admirer.first_name || ''} ${admirer.last_name || ''}`.trim();
  
  const handleViewProfile = () => {
    if (!isValidUUID(admirer.id)) {
      console.error("Invalid profile ID format:", admirer.id);
      return;
    }
    onViewProfile(admirer.id);
  };
  
  const handleMessage = () => {
    if (!isValidUUID(admirer.id)) {
      console.error("Invalid profile ID format:", admirer.id);
      return;
    }
    onMessage(admirer.id, fullName);
  };
  
  return (
    <div className="flex items-center p-3 border border-matrimony-100 dark:border-matrimony-700 rounded-lg">
      <Avatar 
        className="h-12 w-12 mr-3 cursor-pointer" 
        onClick={handleViewProfile}
      >
        <AvatarImage src={admirer.avatar_url || ''} alt={fullName} />
        <AvatarFallback>{fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      
      <div 
        className="flex-1 min-w-0 cursor-pointer" 
        onClick={handleViewProfile}
      >
        <h3 className="font-medium">
          {fullName}
          {age && <span className="text-matrimony-500 ml-1">({age})</span>}
        </h3>
        <p className="text-sm text-matrimony-500">
          Interested in your profile
        </p>
      </div>
      
      <Button 
        size="sm" 
        variant="outline" 
        className="ml-2"
        onClick={handleMessage}
      >
        <MessageCircle className="h-4 w-4 mr-1" />
        Message
      </Button>
    </div>
  );
};

export default AdmirerItem;
