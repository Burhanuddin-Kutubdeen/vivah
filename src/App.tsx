
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
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import LicensesPolicy from "./pages/LicensesPolicy";
import HowItWorks from "./pages/HowItWorks";
import SuccessStories from "./pages/SuccessStories";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfileProtectedRoute from "./components/ProfileProtectedRoute";
import { useTranslations } from "./hooks/use-translations";
import { Helmet } from "react-helmet";

const queryClient = new QueryClient();

// Wrapper for AnimatePresence
const AnimatedRoutes = () => {
  const location = useLocation();
  const { currentLanguage } = useTranslations();
  
  return (
    <AnimatePresence mode="wait">
      <Helmet>
        <html lang={currentLanguage} />
      </Helmet>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* New pages */}
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/success-stories" element={<SuccessStories />} />
        
        {/* Legal pages */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/licenses" element={<LicensesPolicy />} />
        
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
            <ProfileProtectedRoute>
              <Discover />
            </ProfileProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProfileProtectedRoute>
              <Profile />
            </ProfileProtectedRoute>
          } 
        />
        <Route 
          path="/messages" 
          element={
            <ProfileProtectedRoute>
              <Messages />
            </ProfileProtectedRoute>
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
