
import React from 'react';

const HowItWorksFAQ = () => {
  return (
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
  );
};

export default HowItWorksFAQ;
