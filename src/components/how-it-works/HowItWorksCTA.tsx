
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HowItWorksCTA = () => {
  return (
    <section className="py-16 px-4 bg-matrimony-600 dark:bg-matrimony-900 text-white">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Perfect Match?</h2>
        <p className="text-xl mb-10 max-w-2xl mx-auto">Join thousands of others who have found their life partner through Vivah.</p>
        <Button size="lg" variant="secondary" className="rounded-full" asChild>
          <Link to="/register">Create Your Free Profile Today</Link>
        </Button>
      </div>
    </section>
  );
};

export default HowItWorksCTA;
