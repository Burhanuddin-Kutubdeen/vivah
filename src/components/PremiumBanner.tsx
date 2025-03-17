
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useTranslations } from '@/hooks/use-translations';

const PremiumBanner: React.FC = () => {
  const { translate } = useTranslations();
  
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-gradient-to-r from-matrimony-100/50 to-secondary/10 rounded-full -translate-x-1/2 -translate-y-1/2 filter blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="glass-card rounded-3xl p-10 md:p-16 overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-4xl font-bold mb-6"
              >
                Unlock Premium Features for Better Matches
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-lg text-matrimony-600 mb-8"
              >
                Subscribe to our premium plan and enjoy exclusive benefits that will enhance your matchmaking experience.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 flex-shrink-0">
                      <Check size={16} className="text-matrimony-600" />
                    </div>
                    <p className="text-matrimony-600">Unlimited messaging with all matches</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 flex-shrink-0">
                      <Check size={16} className="text-matrimony-600" />
                    </div>
                    <p className="text-matrimony-600">Advanced filters for better matches</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 flex-shrink-0">
                      <Check size={16} className="text-matrimony-600" />
                    </div>
                    <p className="text-matrimony-600">See who liked your profile</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 flex-shrink-0">
                      <Check size={16} className="text-matrimony-600" />
                    </div>
                    <p className="text-matrimony-600">Priority customer support</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Button 
                  size="lg" 
                  className="rounded-full bg-matrimony-600 hover:bg-matrimony-700 text-white px-8 py-6"
                  asChild
                >
                  <Link to="/pricing">View Premium Plans</Link>
                </Button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="absolute -top-3 -right-3">
                  <span className="bg-secondary text-white text-xs font-semibold px-3 py-1 rounded-full">POPULAR</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Premium Membership</h3>
                <p className="text-matrimony-600 mb-6">Everything you need for successful matchmaking</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold">{translate('pricing_monthly')}</span>
                  <span className="text-matrimony-600">{translate('per_month')}</span>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center">
                    <Check size={18} className="text-matrimony-700 mr-3" />
                    <span>All Basic Features</span>
                  </div>
                  <div className="flex items-center">
                    <Check size={18} className="text-matrimony-700 mr-3" />
                    <span>Unlimited Messaging</span>
                  </div>
                  <div className="flex items-center">
                    <Check size={18} className="text-matrimony-700 mr-3" />
                    <span>See Who Likes You</span>
                  </div>
                  <div className="flex items-center">
                    <Check size={18} className="text-matrimony-700 mr-3" />
                    <span>Advanced Filters</span>
                  </div>
                  <div className="flex items-center">
                    <Check size={18} className="text-matrimony-700 mr-3" />
                    <span>Priority Support</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full rounded-full bg-matrimony-600 hover:bg-matrimony-700"
                  asChild
                >
                  <Link to="/register">Get Started</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumBanner;
