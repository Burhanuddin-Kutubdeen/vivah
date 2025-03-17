
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MatchesContainer from '@/components/matching/MatchesContainer';
import AnimatedTransition from '@/components/AnimatedTransition';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Matches: React.FC = () => {
  const isOffline = useOnlineStatus();
  const { user } = useAuth();

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-gradient-to-b from-white to-matrimony-50 dark:from-gray-900 dark:to-gray-800">
        <Navbar />

        <main className="pt-24 pb-16">
          {isOffline && (
            <div className="container mx-auto px-4 mb-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>You're offline</AlertTitle>
                <AlertDescription>
                  You're currently offline. Some features may be limited until you reconnect.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <MatchesContainer />
        </main>

        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default Matches;
