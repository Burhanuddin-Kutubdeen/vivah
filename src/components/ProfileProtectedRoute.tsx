
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProfileRequiredRouteProps {
  children: React.ReactNode;
}

const ProfileProtectedRoute: React.FC<ProfileRequiredRouteProps> = ({ children }) => {
  const { user, loading, isProfileComplete, checkProfileCompletion } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    const verifyProfile = async () => {
      if (user && !loading) {
        try {
          console.log("Verifying profile completion status");
          // Verify profile completion status
          const isComplete = await checkProfileCompletion(user.id);
          console.log("Profile completion verification result:", isComplete);
        } catch (error) {
          console.error("Error verifying profile:", error);
        } finally {
          setIsChecking(false);
        }
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
  
  // Prevent infinite loop when already on profile-setup page
  if (!isProfileComplete && location.pathname !== "/profile-setup") {
    console.log('Profile is not complete, redirecting to profile setup');
    return <Navigate to="/profile-setup" replace />;
  }
  
  // If on profile-setup but profile is complete, redirect to discover
  if (isProfileComplete && location.pathname === "/profile-setup") {
    console.log('Profile is already complete, redirecting to discover');
    return <Navigate to="/discover" replace />;
  }
  
  // Render children if authenticated and profile is complete or already on profile-setup
  console.log('Rendering children');
  return <>{children}</>;
};

export default ProfileProtectedRoute;
