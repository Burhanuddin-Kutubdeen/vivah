
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedTransition from '@/components/AnimatedTransition';
import ProfileCard from '@/components/ProfileCard';
import { Button } from "@/components/ui/button";
import { Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Sample profile data
const profiles = [
  {
    id: '1',
    name: 'Anushka',
    age: 28,
    occupation: 'Software Engineer',
    location: 'Colombo, Sri Lanka',
    interests: ['Reading', 'Traveling', 'Cooking'],
    bio: 'Software engineer who loves to explore new cultures through food and travel. Looking for someone who shares my passion for learning and adventures.',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80'
  },
  {
    id: '2',
    name: 'Raj',
    age: 32,
    occupation: 'Doctor',
    location: 'Kandy, Sri Lanka',
    interests: ['Fitness', 'Music', 'Photography'],
    bio: 'Doctor by profession, photographer by passion. I believe in maintaining a healthy lifestyle and finding beauty in everyday moments.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'
  },
  {
    id: '3',
    name: 'Priya',
    age: 27,
    occupation: 'Marketing Manager',
    location: 'Galle, Sri Lanka',
    interests: ['Dancing', 'Painting', 'Yoga'],
    bio: 'Creative soul with a passion for arts and wellness. Looking for someone who appreciates life\'s simple pleasures and values personal growth.',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'
  }
];

const Discover = () => {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check connection status on mount
    const handleOnlineStatus = () => {
      setIsOffline(false);
      toast({
        title: "Connection restored",
        description: "You're back online. Profile discovery is active.",
      });
    };

    const handleOfflineStatus = () => {
      setIsOffline(true);
      toast({
        title: "Connection issue",
        description: "You appear to be offline. Some features may be limited.",
        variant: "destructive",
      });
    };

    // Add event listeners for online/offline status
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOfflineStatus);
    
    // Check initial status
    if (!navigator.onLine) {
      setIsOffline(true);
    }

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOfflineStatus);
    };
  }, [toast]);

  const nextProfile = () => {
    if (currentProfileIndex < profiles.length - 1) {
      setCurrentProfileIndex(currentProfileIndex + 1);
    } else {
      setCurrentProfileIndex(0); // Loop back to the first profile
    }
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-gradient-to-b from-white to-matrimony-50 dark:from-gray-900 dark:to-gray-800">
        <Navbar />

        <main className="pt-24 pb-16 px-4">
          <div className="container mx-auto">
            {isOffline && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Connection Issue</AlertTitle>
                <AlertDescription>
                  You are currently offline. Some features may be limited until your connection is restored.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">Discover</h1>
                <p className="text-matrimony-600 dark:text-matrimony-300">Find your perfect match</p>
              </div>
              <div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full border-matrimony-200 hover:border-matrimony-300 hover:bg-matrimony-50 dark:border-gray-700"
                  onClick={toggleFilter}
                >
                  <Filter size={16} className="mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Filters panel (conditionally rendered) */}
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 mb-8"
              >
                <h3 className="text-lg font-medium mb-4">Filter Profiles</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-matrimony-600 dark:text-matrimony-300 mb-2">Age Range</label>
                    <div className="flex items-center space-x-3">
                      <input 
                        type="number" 
                        placeholder="Min" 
                        min="18" 
                        max="80" 
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-matrimony-500 bg-white dark:bg-gray-800"
                      />
                      <span>to</span>
                      <input 
                        type="number" 
                        placeholder="Max" 
                        min="18" 
                        max="80" 
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-matrimony-500 bg-white dark:bg-gray-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-matrimony-600 dark:text-matrimony-300 mb-2">Location</label>
                    <select className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-matrimony-500 bg-white dark:bg-gray-800">
                      <option value="">Any location</option>
                      <option value="colombo">Colombo</option>
                      <option value="kandy">Kandy</option>
                      <option value="galle">Galle</option>
                      <option value="jaffna">Jaffna</option>
                      <option value="negombo">Negombo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-matrimony-600 dark:text-matrimony-300 mb-2">Interests</label>
                    <input 
                      type="text" 
                      placeholder="E.g. Travel, Cooking, Reading" 
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-matrimony-500 bg-white dark:bg-gray-800"
                    />
                  </div>
                </div>
                <div className="mt-5 flex justify-end space-x-3">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="rounded-full border-matrimony-200"
                    onClick={toggleFilter}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm"
                    className="rounded-full bg-matrimony-600 hover:bg-matrimony-700"
                  >
                    Apply Filters
                  </Button>
                </div>
              </motion.div>
            )}

            <div className="flex justify-center">
              <ProfileCard profile={profiles[currentProfileIndex]} />
            </div>

            <div className="mt-8 text-center">
              <Button 
                size="lg" 
                className="rounded-full bg-matrimony-600 hover:bg-matrimony-700 text-white px-8"
                onClick={nextProfile}
                disabled={isOffline}
              >
                View Next Profile
              </Button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default Discover;
