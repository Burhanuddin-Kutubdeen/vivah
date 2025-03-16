
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProfileRequiredRouteProps {
  children: React.ReactNode;
}

const ProfileProtectedRoute: React.FC<ProfileRequiredRouteProps> = ({ children }) => {
  const { user, loading, isProfileComplete, checkProfileCompletion } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    const verifyProfile = async () => {
      if (user && !loading) {
        // Verify profile completion status
        await checkProfileCompletion(user.id);
        setIsChecking(false);
      } else if (!loading) {
        setIsChecking(false);
      }
    };
    
    verifyProfile();
  }, [user, loading, checkProfileCompletion]);
  
  // Show loading indicator while checking authentication and profile
  if (loading || isChecking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-matrimony-500" />
        <p className="mt-4 text-matrimony-600">Loading your profile...</p>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect to profile setup if profile is not complete
  if (!isProfileComplete) {
    console.log('Profile is not complete, redirecting to profile setup');
    return <Navigate to="/profile-setup" replace />;
  }
  
  // Render children if authenticated and profile is complete
  console.log('Profile is complete, rendering children');
  return <>{children}</>;
};

export default ProfileProtectedRoute;
