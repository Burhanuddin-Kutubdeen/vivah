
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Admirer {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  date_of_birth: string | null;
}

interface ProfileAdmirersProps {
  calculateAge: (dateOfBirth: string) => number;
}

const ProfileAdmirers: React.FC<ProfileAdmirersProps> = ({ calculateAge }) => {
  const [admirers, setAdmirers] = useState<Admirer[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchAdmirers = async () => {
      if (!user) return;
      
      try {
        // Fetch likes where the current user is the liked profile
        const { data, error } = await supabase
          .from('likes')
          .select(`
            user_id,
            profiles:user_id(
              id, 
              first_name, 
              last_name, 
              avatar_url,
              date_of_birth
            )
          `)
          .eq('liked_profile_id', user.id)
          .eq('status', 'pending');
          
        if (error) throw error;
        
        // Transform the data to get the admirer profiles
        const admirerProfiles = data
          .map(item => item.profiles as Admirer)
          .filter(Boolean);
          
        setAdmirers(admirerProfiles);
      } catch (err) {
        console.error('Error fetching admirers:', err);
        toast({
          title: "Error",
          description: "Failed to load admirers",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdmirers();
  }, [user]);
  
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
          const fullName = `${admirer.first_name || ''} ${admirer.last_name || ''}`.trim();
          const age = admirer.date_of_birth ? calculateAge(admirer.date_of_birth) : null;
          
          return (
            <div key={admirer.id} className="flex items-center p-3 border border-matrimony-100 dark:border-matrimony-700 rounded-lg">
              <Avatar className="h-12 w-12 mr-3 cursor-pointer" onClick={() => handleViewProfile(admirer.id)}>
                <AvatarImage src={admirer.avatar_url || ''} alt={fullName} />
                <AvatarFallback>{fullName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleViewProfile(admirer.id)}>
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
                onClick={() => handleMessage(admirer.id, fullName)}
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                Message
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileAdmirers;
