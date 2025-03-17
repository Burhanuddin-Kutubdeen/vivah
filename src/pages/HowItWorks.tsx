
import React from 'react';
import { motion } from 'framer-motion';
import AnimatedTransition from '@/components/AnimatedTransition';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTranslations } from '@/hooks/use-translations';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { SearchCheck, UserRound, Heart, MessageCircle, Gem } from 'lucide-react';

const HowItWorks = () => {
  const { translate } = useTranslations();

  const steps = [
    {
      id: 1,
      title: "Create Your Profile",
      description: "Complete your profile with personal details, preferences, and what you're looking for in a partner. The more information you provide, the better matches you'll receive.",
      icon: <UserRound className="h-12 w-12 text-matrimony-600" />,
    },
    {
      id: 2,
      title: "Discover Potential Matches",
      description: "Browse through our curated 'For You' matches or try the 'Swipe Mode' to discover compatible partners. Our matching algorithm considers your preferences, values, and interests.",
      icon: <SearchCheck className="h-12 w-12 text-matrimony-600" />,
    },
    {
      id: 3,
      title: "Express Interest",
      description: "When you find someone interesting, express your interest with a 'Like'. If they like you back, it's a match! Premium members get unlimited likes and can see who liked them.",
      icon: <Heart className="h-12 w-12 text-matrimony-600" />,
    },
    {
      id: 4,
      title: "Connect and Communicate",
      description: "Once matched, start a conversation through our secure messaging system. Build a connection and get to know each other before deciding to meet in person.",
      icon: <MessageCircle className="h-12 w-12 text-matrimony-600" />,
    },
    {
      id: 5,
      title: "Find Your Perfect Match",
      description: "Build meaningful relationships that could lead to marriage. Many of our users have found their perfect match and life partner through our platform.",
      icon: <Gem className="h-12 w-12 text-matrimony-600" />,
    },
  ];

  const testimonial = {
    quote: "The guided process made it easy to find someone who shares my values and life goals. Within three months, I met my now-fiancé!",
    name: "Priya Sharma",
    role: "Engaged via Vivah",
    image: "/placeholder.svg"
  };

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
        {/* Hero Section */}
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

        {/* Steps Section */}
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
                        src="/placeholder.svg" 
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

        {/* Testimonial Section */}
        <section className="py-16 px-4 bg-matrimony-50 dark:bg-gray-900">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
              <p className="text-matrimony-600 dark:text-matrimony-300">Hear from couples who found their perfect match on Vivah</p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-sm"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden flex-shrink-0">
                  <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <blockquote className="text-xl md:text-2xl italic mb-6">"{testimonial.quote}"</blockquote>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-matrimony-600 dark:text-matrimony-300">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
            
            <div className="text-center mt-12">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/success-stories">Read More Success Stories</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24 px-4 bg-white dark:bg-gray-800">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-matrimony-50 dark:bg-gray-700 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-2">Is Vivah only for Sri Lankans?</h3>
                <p className="text-matrimony-600 dark:text-matrimony-300">While we primarily serve the Sri Lankan community, Vivah is open to Sri Lankans living anywhere in the world, as well as those interested in finding a Sri Lankan partner.</p>
              </div>
              
              <div className="bg-matrimony-50 dark:bg-gray-700 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-2">How much does Vivah cost?</h3>
                <p className="text-matrimony-600 dark:text-matrimony-300">Vivah offers both free and premium memberships. Our premium membership costs 5,000 LKR per month and includes unlimited messaging, advanced filters, and more.</p>
              </div>
              
              <div className="bg-matrimony-50 dark:bg-gray-700 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-2">How does the matching algorithm work?</h3>
                <p className="text-matrimony-600 dark:text-matrimony-300">Our matching algorithm considers multiple factors including your preferences, values, interests, education, and more to suggest compatible matches.</p>
              </div>
              
              <div className="bg-matrimony-50 dark:bg-gray-700 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-2">Is my information secure?</h3>
                <p className="text-matrimony-600 dark:text-matrimony-300">Yes, we take privacy and security very seriously. Your personal information is encrypted and we never share your contact details without your permission.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-matrimony-600 dark:bg-matrimony-900 text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Perfect Match?</h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto">Join thousands of others who have found their life partner through Vivah.</p>
            <Button size="lg" variant="secondary" className="rounded-full" asChild>
              <Link to="/register">Create Your Free Profile Today</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </AnimatedTransition>
  );
};

export default HowItWorks;
