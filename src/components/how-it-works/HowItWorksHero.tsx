
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from '@/hooks/use-translations';

const HowItWorksHero = () => {
  const { translate } = useTranslations();

  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-matrimony-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto text-center max-w-4xl">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          How Vivah Helps You Find Your Perfect Match
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xl text-matrimony-600 dark:text-matrimony-300 mb-10 mx-auto max-w-3xl"
        >
          Our simple and guided process helps thousands of people find their perfect life partner every year.
        </motion.p>
      </div>
    </section>
  );
};

export default HowItWorksHero;
