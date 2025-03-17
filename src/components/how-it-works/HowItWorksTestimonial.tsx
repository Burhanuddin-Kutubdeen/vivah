
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HowItWorksTestimonial = () => {
  const testimonial = {
    quote: "The guided process made it easy to find someone who shares my values and life goals. Within three months, I met my now-fiancé!",
    name: "Priya Sharma",
    role: "Engaged via Vivah",
    image: "/placeholder.svg"
  };

  return (
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
  );
};

export default HowItWorksTestimonial;
