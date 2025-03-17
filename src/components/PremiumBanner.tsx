
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useTranslations } from '@/hooks/use-translations';

const PremiumBanner: React.FC = () => {
  const { translate } = useTranslations();
  
  const features = [
    "Unlimited messaging with all matches",
    "Advanced filters for better matches",
    "See who liked your profile",
    "Priority customer support",
    "Enhanced profile visibility",
    "Exclusive matchmaking events",
  ];
  
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-gradient-to-r from-matrimony-100/50 to-secondary/10 rounded-full -translate-x-1/2 -translate-y-1/2 filter blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="glass-card rounded-3xl p-8 md:p-12 overflow-hidden relative bg-white/90 dark:bg-gray-800/90 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-4xl font-bold mb-6"
              >
                Premium Membership
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-lg text-matrimony-600 dark:text-matrimony-400 mb-8"
              >
                Upgrade to Premium and get access to exclusive features that will maximize your chances of finding your perfect match.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="mt-1 flex-shrink-0 bg-matrimony-100 dark:bg-matrimony-800 rounded-full p-1">
                        <Check size={14} className="text-matrimony-600 dark:text-matrimony-300" />
                      </div>
                      <p className="text-matrimony-600 dark:text-matrimony-300">{feature}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-8 md:mb-0"
              >
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold text-matrimony-700 dark:text-matrimony-300">{translate('pricing_monthly')}</span>
                  <span className="text-matrimony-500 dark:text-matrimony-400">{translate('per_month')}</span>
                </div>
                
                <Button 
                  size="lg" 
                  className="rounded-full bg-matrimony-600 hover:bg-matrimony-700 text-white px-8"
                  asChild
                >
                  <Link to="/pricing">Get Premium Now</Link>
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
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80" 
                  alt="Happy couple who met through Vivah" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                  <p className="text-white text-lg font-medium">
                    "The premium features helped us find each other within weeks!"
                  </p>
                  <p className="text-white/80 text-sm mt-2">
                    — Ravi & Meena, Married 2023
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumBanner;
