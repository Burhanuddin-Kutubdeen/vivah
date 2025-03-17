
import React from 'react';
import AnimatedTransition from '@/components/AnimatedTransition';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTranslations } from '@/hooks/use-translations';
import { Helmet } from 'react-helmet';
import SuccessStoriesHero from '@/components/success-stories/SuccessStoriesHero';
import SuccessStoriesStats from '@/components/success-stories/SuccessStoriesStats';
import SuccessStoryList from '@/components/success-stories/SuccessStoryList';
import SuccessStoriesTestimonials from '@/components/success-stories/SuccessStoriesTestimonials';
import SuccessStoriesCTA from '@/components/success-stories/SuccessStoriesCTA';

const SuccessStories = () => {
  const { translate } = useTranslations();

  return (
    <AnimatedTransition>
      <Helmet>
        <title>Success Stories | Vivah - Real Life Matrimony Success Stories</title>
        <meta name="description" content="Read inspiring stories of couples who found their perfect match on Vivah, Sri Lanka's leading matrimony platform. Real people, real connections, real marriages." />
        <meta name="keywords" content="matrimony success stories, marriage success, Sri Lankan couples, arranged marriage success, Vivah testimonials" />
        <link rel="canonical" href="https://vivah.com/success-stories" />
        <meta property="og:title" content="Success Stories | Vivah - Real Life Matrimony Success Stories" />
        <meta property="og:description" content="Read inspiring stories of couples who found their perfect match on Vivah, Sri Lanka's leading matrimony platform." />
        <meta property="og:url" content="https://vivah.com/success-stories" />
        <meta property="og:type" content="website" />
      </Helmet>

      <Navbar />
      
      <main className="pt-20">
        <SuccessStoriesHero />
        <SuccessStoriesStats />
        <SuccessStoryList />
        <SuccessStoriesTestimonials />
        <SuccessStoriesCTA />
      </main>

      <Footer />
    </AnimatedTransition>
  );
};

export default SuccessStories;
