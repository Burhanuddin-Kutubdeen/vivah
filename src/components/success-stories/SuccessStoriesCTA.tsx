
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const SuccessStoriesCTA = () => {
  return (
    <section className="py-16 px-4 bg-matrimony-600 dark:bg-matrimony-900 text-white bg-[url('https://images.unsplash.com/photo-1603754458822-f8479f4749a5?auto=format&fit=crop&q=80&brightness=-25%')] bg-cover bg-center bg-blend-overlay">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Your Success Story Awaits</h2>
        <p className="text-xl mb-10 max-w-2xl mx-auto">Join thousands of others who found their perfect match on Sri Lanka's most trusted matrimony platform.</p>
        <Button size="lg" variant="secondary" className="rounded-full" asChild>
          <Link to="/register">Create Your Free Profile</Link>
        </Button>
      </div>
    </section>
  );
};

export default SuccessStoriesCTA;
