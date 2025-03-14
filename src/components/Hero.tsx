
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen py-20 flex items-center">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-matrimony-100 rounded-full -translate-x-1/2 -translate-y-1/2 filter blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full translate-x-1/4 translate-y-1/4 filter blur-3xl opacity-40"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="inline-block mb-4">
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                Modern Matrimony Platform
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              Find Your Perfect <span className="text-matrimony-700">Match</span> Beyond Conventional Metrics
            </h1>
            <p className="text-lg mb-8 text-matrimony-600 max-w-lg mx-auto lg:mx-0">
              A modern approach to matrimony that prioritizes genuine connections, shared interests, and lifestyle compatibility over traditional metrics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="rounded-full bg-matrimony-600 hover:bg-matrimony-700 text-white px-8 py-6"
                asChild
              >
                <Link to="/register">Create Profile</Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full border-matrimony-300 text-matrimony-700 hover:bg-matrimony-50 px-8 py-6"
                asChild
              >
                <Link to="/how-it-works">How It Works</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative h-[600px] w-full">
              {/* Large Profile Card */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="absolute top-0 right-0 w-72 h-96 glass-card rounded-2xl overflow-hidden shadow-xl z-20"
              >
                <img 
                  src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80" 
                  alt="Profile" 
                  className="w-full h-3/5 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg">Rahul, 29</h3>
                  <p className="text-sm text-matrimony-600">Product Designer</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-matrimony-100 text-matrimony-700 text-xs rounded-full">Travel</span>
                    <span className="px-2 py-1 bg-matrimony-100 text-matrimony-700 text-xs rounded-full">Art</span>
                    <span className="px-2 py-1 bg-matrimony-100 text-matrimony-700 text-xs rounded-full">Books</span>
                  </div>
                </div>
              </motion.div>

              {/* Medium Profile Card */}
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="absolute bottom-0 right-16 w-72 h-80 glass-card rounded-2xl overflow-hidden shadow-xl z-10"
              >
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80" 
                  alt="Profile" 
                  className="w-full h-3/5 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg">Priya, 27</h3>
                  <p className="text-sm text-matrimony-600">Software Engineer</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-matrimony-100 text-matrimony-700 text-xs rounded-full">Cooking</span>
                    <span className="px-2 py-1 bg-matrimony-100 text-matrimony-700 text-xs rounded-full">Hiking</span>
                  </div>
                </div>
              </motion.div>

              {/* Small Profile Card */}
              <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.8 }}
                className="absolute top-1/4 left-0 w-72 h-72 glass-card rounded-2xl overflow-hidden shadow-xl"
              >
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80" 
                  alt="Profile" 
                  className="w-full h-3/5 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg">Arun, 32</h3>
                  <p className="text-sm text-matrimony-600">Doctor</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-matrimony-100 text-matrimony-700 text-xs rounded-full">Music</span>
                    <span className="px-2 py-1 bg-matrimony-100 text-matrimony-700 text-xs rounded-full">Fitness</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-16 lg:mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          <div>
            <h3 className="text-3xl lg:text-4xl font-bold text-matrimony-700 mb-2">20K+</h3>
            <p className="text-matrimony-600">Active Members</p>
          </div>
          <div>
            <h3 className="text-3xl lg:text-4xl font-bold text-matrimony-700 mb-2">1.5K+</h3>
            <p className="text-matrimony-600">Successful Matches</p>
          </div>
          <div>
            <h3 className="text-3xl lg:text-4xl font-bold text-matrimony-700 mb-2">4.9/5</h3>
            <p className="text-matrimony-600">User Rating</p>
          </div>
          <div>
            <h3 className="text-3xl lg:text-4xl font-bold text-matrimony-700 mb-2">85%</h3>
            <p className="text-matrimony-600">Match Rate</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
