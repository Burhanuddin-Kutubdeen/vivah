
import React from 'react';
import { motion } from 'framer-motion';

const SuccessStoriesHero = () => {
  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-matrimony-50 to-white dark:from-gray-900 dark:to-gray-800 bg-[url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&brightness=-10%')] bg-cover bg-center bg-blend-soft-light">
      <div className="container mx-auto text-center max-w-4xl">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          Success Stories from Real Couples
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xl text-matrimony-600 dark:text-matrimony-300 mb-10 mx-auto max-w-3xl"
        >
          Discover how thousands of Sri Lankans found their perfect match and lifelong partner through Vivah.
        </motion.p>
      </div>
    </section>
  );
};

export default SuccessStoriesHero;
