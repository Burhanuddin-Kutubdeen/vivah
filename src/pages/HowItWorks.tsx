
import React from 'react';
import { Helmet } from 'react-helmet';
import AnimatedTransition from '@/components/AnimatedTransition';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HowItWorksHero from '@/components/how-it-works/HowItWorksHero';
import HowItWorksSteps from '@/components/how-it-works/HowItWorksSteps';
import HowItWorksTestimonial from '@/components/how-it-works/HowItWorksTestimonial';
import HowItWorksFAQ from '@/components/how-it-works/HowItWorksFAQ';
import HowItWorksCTA from '@/components/how-it-works/HowItWorksCTA';

const HowItWorks = () => {
  return (
    <AnimatedTransition>
      <Helmet>
        <title>How It Works | Vivah - Find Your Perfect Life Partner</title>
        <meta name="description" content="Learn how Vivah helps you find your perfect match. Our simple 5-step process guides you from profile creation to meaningful connection with potential life partners." />
        <meta name="keywords" content="matrimony platform, marriage matching, how matrimony works, find life partner, Sri Lankan matrimony process" />
        <link rel="canonical" href="https://vivah.com/how-it-works" />
        <meta property="og:title" content="How It Works | Vivah - Find Your Perfect Life Partner" />
        <meta property="og:description" content="Discover our simple 5-step process to find your perfect match on Vivah, Sri Lanka's premier matrimony platform." />
        <meta property="og:url" content="https://vivah.com/how-it-works" />
        <meta property="og:type" content="website" />
      </Helmet>

      <Navbar />
      
      <main className="pt-20">
        <HowItWorksHero />
        <HowItWorksSteps />
        <HowItWorksTestimonial />
        <HowItWorksFAQ />
        <HowItWorksCTA />
      </main>

      <Footer />
    </AnimatedTransition>
  );
};

export default HowItWorks;
