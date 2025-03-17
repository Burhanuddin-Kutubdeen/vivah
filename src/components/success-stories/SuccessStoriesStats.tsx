
import React from 'react';

const SuccessStoriesStats = () => {
  return (
    <section className="py-10 bg-white dark:bg-gray-800">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4">
            <p className="text-3xl md:text-4xl font-bold text-matrimony-600">5000+</p>
            <p className="text-sm md:text-base text-matrimony-500">Successful Marriages</p>
          </div>
          <div className="text-center p-4">
            <p className="text-3xl md:text-4xl font-bold text-matrimony-600">87%</p>
            <p className="text-sm md:text-base text-matrimony-500">Match Success Rate</p>
          </div>
          <div className="text-center p-4">
            <p className="text-3xl md:text-4xl font-bold text-matrimony-600">3</p>
            <p className="text-sm md:text-base text-matrimony-500">Months Average Time</p>
          </div>
          <div className="text-center p-4">
            <p className="text-3xl md:text-4xl font-bold text-matrimony-600">96%</p>
            <p className="text-sm md:text-base text-matrimony-500">Customer Satisfaction</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesStats;
