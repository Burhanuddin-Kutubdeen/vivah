
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, Filter, MessageCircle } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
  >
    <div className="w-12 h-12 bg-matrimony-100 dark:bg-matrimony-900/30 text-matrimony-600 dark:text-matrimony-400 rounded-xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-matrimony-600 dark:text-matrimony-300">{description}</p>
  </motion.div>
);

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 px-4" id="features">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-matrimony-600 font-medium text-sm uppercase tracking-wider"
          >
            Features
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mt-2 mb-6"
          >
            How We Stand Out
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-matrimony-600 dark:text-matrimony-300"
          >
            We've reimagined the matrimony experience with features designed to foster genuine connections based on what truly matters.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Heart size={24} />}
            title="Interest-Based Matching"
            description="Our algorithm prioritizes shared interests and lifestyle choices, not just traditional metrics."
            delay={0.1}
          />
          <FeatureCard
            icon={<Filter size={24} />}
            title="Personalized Filters"
            description="Customize your search with filters that matter to you, from hobbies to life values."
            delay={0.2}
          />
          <FeatureCard
            icon={<Shield size={24} />}
            title="Verified Profiles"
            description="All profiles undergo a verification process to ensure authenticity and safety."
            delay={0.3}
          />
          <FeatureCard
            icon={<MessageCircle size={24} />}
            title="Meaningful Conversations"
            description="Our platform encourages deep conversations with thoughtful prompts and guides."
            delay={0.4}
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
