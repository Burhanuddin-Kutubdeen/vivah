
import React from 'react';
import { motion } from 'framer-motion';

const SuccessStoriesTestimonials = () => {
  return (
    <section className="py-16 px-4 bg-matrimony-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Members Say</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
          >
            <p className="italic mb-4">"The verification process made me feel safe, knowing I was talking to genuine people looking for a serious relationship."</p>
            <p className="font-semibold">— Kumari T.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
          >
            <p className="italic mb-4">"As a busy professional, Vivah saved me time by suggesting matches that actually aligned with what I was looking for."</p>
            <p className="font-semibold">— Dinesh M.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
          >
            <p className="italic mb-4">"I appreciated that I could use the platform in my native language. It made the whole experience more comfortable."</p>
            <p className="font-semibold">— Selvi R.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
          >
            <p className="italic mb-4">"The premium membership was worth every rupee. The advanced features helped me find my wife within two months!"</p>
            <p className="font-semibold">— Saman J.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesTestimonials;
