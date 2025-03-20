
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAdmirers } from './hooks/useAdmirers';
import AdmirerItem from './AdmirerItem';

interface ProfileAdmirersProps {
  calculateAge: (dateOfBirth: string) => number;
}

const ProfileAdmirers: React.FC<ProfileAdmirersProps> = ({ calculateAge }) => {
  const { admirers, loading } = useAdmirers();
  const navigate = useNavigate();
  
  const handleViewProfile = (id: string) => {
    navigate(`/profile-view/${id}`);
  };
  
  const handleMessage = (id: string, name: string) => {
    navigate(`/messages?userId=${id}&name=${encodeURIComponent(name)}`);
    
    toast({
      title: "Message Started",
      description: `You can now message ${name}`,
    });
  };
  
  if (loading) {
    return (
      <div className="mt-6">
        <h2 className="text-lg font-medium mb-3">Interested In You</h2>
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-matrimony-500" />
        </div>
      </div>
    );
  }
  
  if (admirers.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-6">
      <h2 className="text-lg font-medium mb-3">Interested In You</h2>
      <div className="grid grid-cols-1 gap-4">
        {admirers.map((admirer) => {
          const age = admirer.date_of_birth ? calculateAge(admirer.date_of_birth) : null;
          
          return (
            <AdmirerItem
              key={admirer.id}
              admirer={admirer}
              age={age}
              onViewProfile={handleViewProfile}
              onMessage={handleMessage}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProfileAdmirers;
