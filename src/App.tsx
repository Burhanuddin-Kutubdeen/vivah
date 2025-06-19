
import { Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Discover from './pages/Discover';
import Messages from './pages/Messages';
import Matches from './pages/Matches';
import LikedYou from './pages/LikedYou';
import ProfileSetup from './pages/ProfileSetup';
import HowItWorks from './pages/HowItWorks';
import SuccessStories from './pages/SuccessStories';
import CookiePolicy from './pages/CookiePolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import LicensesPolicy from './pages/LicensesPolicy';
import ProtectedRoute from './components/ProtectedRoute';
import ProfileProtectedRoute from './components/ProfileProtectedRoute';
import { Suspense } from 'react';
import './App.css';

function App() {
  console.log('App component is rendering');
  
  return (
    <>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-matrimony-500 mx-auto"></div>
            <p className="mt-4 text-matrimony-600">Loading application...</p>
          </div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/success-stories" element={<SuccessStories />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/licenses" element={<LicensesPolicy />} />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/discover" element={
            <ProtectedRoute>
              <Discover />
            </ProtectedRoute>
          } />
          <Route path="/messages" element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          } />
          <Route path="/matches" element={
            <ProtectedRoute>
              <Matches />
            </ProtectedRoute>
          } />
          <Route path="/liked-you" element={
            <ProtectedRoute>
              <LikedYou />
            </ProtectedRoute>
          } />
          
          <Route path="/profile-setup" element={
            <ProfileProtectedRoute>
              <ProfileSetup />
            </ProfileProtectedRoute>
          } />
          
          {/* Catch-all route for NotFound */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;
