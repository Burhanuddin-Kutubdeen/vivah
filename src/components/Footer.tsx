
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Vivah</h3>
            <p className="text-matrimony-600 dark:text-matrimony-400 text-sm">
              Bringing hearts together, creating lifelong bonds.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-matrimony-600 dark:text-matrimony-400 hover:text-matrimony-700 dark:hover:text-matrimony-300 text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/discover" className="text-matrimony-600 dark:text-matrimony-400 hover:text-matrimony-700 dark:hover:text-matrimony-300 text-sm transition-colors">
                  Discover
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-matrimony-600 dark:text-matrimony-400 hover:text-matrimony-700 dark:hover:text-matrimony-300 text-sm transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/success-stories" className="text-matrimony-600 dark:text-matrimony-400 hover:text-matrimony-700 dark:hover:text-matrimony-300 text-sm transition-colors">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-matrimony-600 dark:text-matrimony-400 hover:text-matrimony-700 dark:hover:text-matrimony-300 text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-matrimony-600 dark:text-matrimony-400 hover:text-matrimony-700 dark:hover:text-matrimony-300 text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-matrimony-600 dark:text-matrimony-400 hover:text-matrimony-700 dark:hover:text-matrimony-300 text-sm transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/licenses" className="text-matrimony-600 dark:text-matrimony-400 hover:text-matrimony-700 dark:hover:text-matrimony-300 text-sm transition-colors">
                  Licenses
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-matrimony-600 dark:text-matrimony-400 text-sm">
                support@vivah.com
              </li>
              <li className="text-matrimony-600 dark:text-matrimony-400 text-sm">
                +94 11 234 5678
              </li>
              <li className="text-matrimony-600 dark:text-matrimony-400 text-sm">
                Colombo, Sri Lanka
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 dark:border-gray-700 mt-8 pt-8 text-center text-sm text-matrimony-500 dark:text-matrimony-400">
          <p>© {currentYear} Vivah. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
