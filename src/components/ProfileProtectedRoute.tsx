
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProfileRequiredRouteProps {
  children: React.ReactNode;
}

const ProfileProtectedRoute: React.FC<ProfileRequiredRouteProps> = ({ children }) => {
  const { user, loading, isProfileComplete } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [checkCount, setCheckCount] = useState(0);
  const location = useLocation();
  
  useEffect(() => {
    // Only check profile if we haven't checked too many times (prevent infinite loops)
    const verifyProfile = async () => {
      if (user && !loading && checkCount < 3) {
        setCheckCount(prev => prev + 1);
        try {
          console.log("Verifying profile completion status, attempt:", checkCount + 1);
          // We don't call checkProfileCompletion again since we're using the state from AuthContext
          setIsChecking(false);
        } catch (error) {
          console.error("Error verifying profile:", error);
          setIsChecking(false);
        }
      } else if (!loading) {
        setIsChecking(false);
      }
    };
    
    verifyProfile();
  }, [user, loading, checkCount]);
  
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
  console.log('Rendering children, profile complete:', isProfileComplete);
  return <>{children}</>;
};

export default ProfileProtectedRoute;
