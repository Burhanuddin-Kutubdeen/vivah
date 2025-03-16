
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileRequiredRouteProps {
  children: React.ReactNode;
}

const ProfileProtectedRoute: React.FC<ProfileRequiredRouteProps> = ({ children }) => {
  const { user, loading, isProfileComplete } = useAuth();
  
  // Show loading indicator while checking authentication
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect to profile setup if profile is not complete
  if (!isProfileComplete) {
    return <Navigate to="/profile-setup" replace />;
  }
  
  // Render children if authenticated and profile is complete
  return <>{children}</>;
};

export default ProfileProtectedRoute;
