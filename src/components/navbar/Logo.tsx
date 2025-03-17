
import React from 'react';
import { Link } from 'react-router-dom';

const Logo: React.FC = () => {
  return (
    <Link 
      to="/" 
      className="flex items-center space-x-2"
    >
      <span className="text-2xl font-serif font-bold text-matrimony-700">
        Vivah
      </span>
    </Link>
  );
};

export default Logo;
