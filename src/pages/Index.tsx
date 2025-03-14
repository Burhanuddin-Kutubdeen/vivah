
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturesSection from '@/components/FeaturesSection';
import PremiumBanner from '@/components/PremiumBanner';
import Footer from '@/components/Footer';
import AnimatedTransition from '@/components/AnimatedTransition';

const Index = () => {
  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        <Hero />
        <FeaturesSection />
        <PremiumBanner />
        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default Index;
