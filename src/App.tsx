
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import ProfileSetup from "./pages/ProfileSetup";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

// Route that requires completed profile
const ProfileRequiredRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isProfileComplete } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isProfileComplete) {
    return <Navigate to="/profile-setup" replace />;
  }
  
  return <>{children}</>;
};

// Wrapper for AnimatePresence
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* Routes that require authentication */}
        <Route 
          path="/profile-setup" 
          element={
            <ProtectedRoute>
              <ProfileSetup />
            </ProtectedRoute>
          } 
        />
        
        {/* Routes that require completed profile */}
        <Route 
          path="/discover" 
          element={
            <ProfileRequiredRoute>
              <Discover />
            </ProfileRequiredRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProfileRequiredRoute>
              <Profile />
            </ProfileRequiredRoute>
          } 
        />
        <Route 
          path="/messages" 
          element={
            <ProfileRequiredRoute>
              <Messages />
            </ProfileRequiredRoute>
          } 
        />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const AppWithAuth = () => (
  <AuthProvider>
    <AnimatedRoutes />
  </AuthProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppWithAuth />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
