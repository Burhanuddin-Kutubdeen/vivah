
import React from 'react';
import { motion } from 'framer-motion';
import { SearchCheck, UserRound, Heart, MessageCircle, Gem } from 'lucide-react';

const HowItWorksSteps = () => {
  const steps = [
    {
      id: 1,
      title: "Create Your Profile",
      description: "Complete your profile with personal details, preferences, and what you're looking for in a partner. The more information you provide, the better matches you'll receive.",
      icon: <UserRound className="h-12 w-12 text-matrimony-600" />,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80",
    },
    {
      id: 2,
      title: "Discover Potential Matches",
      description: "Browse through our curated 'For You' matches or try the 'Swipe Mode' to discover compatible partners. Our matching algorithm considers your preferences, values, and interests.",
      icon: <SearchCheck className="h-12 w-12 text-matrimony-600" />,
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80",
    },
    {
      id: 3,
      title: "Express Interest",
      description: "When you find someone interesting, express your interest with a 'Like'. If they like you back, it's a match! Premium members get unlimited likes and can see who liked them.",
      icon: <Heart className="h-12 w-12 text-matrimony-600" />,
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80",
    },
    {
      id: 4,
      title: "Connect and Communicate",
      description: "Once matched, start a conversation through our secure messaging system. Build a connection and get to know each other before deciding to meet in person.",
      icon: <MessageCircle className="h-12 w-12 text-matrimony-600" />,
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80",
    },
    {
      id: 5,
      title: "Find Your Perfect Match",
      description: "Build meaningful relationships that could lead to marriage. Many of our users have found their perfect match and life partner through our platform.",
      icon: <Gem className="h-12 w-12 text-matrimony-600" />,
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80",
    },
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-white dark:bg-gray-800">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Our 5-Step Process</h2>
        
        <div className="space-y-24">
          {steps.map((step, index) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10 md:gap-16`}
            >
              <div className="md:w-1/2 relative">
                <div className="absolute -left-4 -top-4 w-12 h-12 rounded-full bg-matrimony-100 flex items-center justify-center font-bold text-matrimony-700 dark:bg-matrimony-900 dark:text-matrimony-100">
                  {step.id}
                </div>
                <div className="bg-matrimony-50 dark:bg-gray-700 p-8 rounded-2xl">
                  {step.icon}
                  <h3 className="text-2xl font-bold mt-6 mb-4">{step.title}</h3>
                  <p className="text-matrimony-600 dark:text-matrimony-300">{step.description}</p>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                  <img 
                    src={step.image} 
                    alt={`Illustration of ${step.title}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSteps;
