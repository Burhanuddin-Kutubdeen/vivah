
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { isValidUUID } from '@/utils/validation';

export const useProfileMessage = (profileId?: string) => {
  const navigate = useNavigate();

  const handleMessage = (id: string, name: string) => {
    if (!isValidUUID(id)) {
      toast.error("Cannot message profile - invalid ID format");
      return false;
    }
    
    // Navigate to messages page with this specific conversation open
    navigate(`/messages?userId=${id}&name=${encodeURIComponent(name)}`);
    
    toast(`Starting conversation with ${name}`, {
      description: "You can now message each other"
    });
    
    return true;
  };

  return { handleMessage };
};
