
import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';

interface MatchCardActionsProps {
  profileId: string;
  name: string;
}

const MatchCardActions: React.FC<MatchCardActionsProps> = ({ profileId, name }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to like profiles",
        variant: "destructive",
      });
      return;
    }

    try {
      // Record the like in the database
      const { error } = await supabase
        .from('likes')
        .insert({
          user_id: user.id,
          liked_profile_id: profileId,
          status: 'pending'
        });

      if (error) throw error;

      // Show success toast
      toast({
        title: "Interest Shown",
        description: `${name} will be notified of your interest`,
      });
    } catch (error) {
      console.error("Error liking profile:", error);
      toast({
        title: "Error",
        description: "Failed to send like. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Navigate to messages page with specific user conversation
    navigate(`/messages?userId=${profileId}&name=${encodeURIComponent(name)}`);
    
    toast({
      title: "Message Request Sent",
      description: `You'll be able to message ${name} once they accept your request`,
    });
  };

  return (
    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 px-4">
      <Button 
        onClick={handleLike}
        size="sm" 
        className="bg-matrimony-100 hover:bg-matrimony-200 text-matrimony-700 rounded-full flex-1"
      >
        <Heart size={16} className="mr-1" />
        Like
      </Button>
      <Button 
        onClick={handleMessage}
        size="sm" 
        className="bg-matrimony-600 hover:bg-matrimony-700 text-white rounded-full flex-1"
      >
        <MessageCircle size={16} className="mr-1" />
        Message
      </Button>
    </div>
  );
};

export default MatchCardActions;
