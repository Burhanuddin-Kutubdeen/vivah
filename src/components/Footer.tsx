
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-matrimony-50 dark:bg-gray-900 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-serif font-bold text-matrimony-700">Mango</span>
              <span className="text-2xl font-serif font-bold text-secondary">Matrimony</span>
            </Link>
            <p className="text-matrimony-600 dark:text-matrimony-300 mb-6">
              A modern approach to matrimony that prioritizes genuine connections and shared interests.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-matrimony-600 hover:text-matrimony-700 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-matrimony-600 hover:text-matrimony-700 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-matrimony-600 hover:text-matrimony-700 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-matrimony-600 hover:text-matrimony-700 dark:text-matrimony-300 dark:hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-matrimony-600 hover:text-matrimony-700 dark:text-matrimony-300 dark:hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-matrimony-600 hover:text-matrimony-700 dark:text-matrimony-300 dark:hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/press" className="text-matrimony-600 hover:text-matrimony-700 dark:text-matrimony-300 dark:hover:text-white transition-colors">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/help-center" className="text-matrimony-600 hover:text-matrimony-700 dark:text-matrimony-300 dark:hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/safety" className="text-matrimony-600 hover:text-matrimony-700 dark:text-matrimony-300 dark:hover:text-white transition-colors">
                  Safety Center
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-matrimony-600 hover:text-matrimony-700 dark:text-matrimony-300 dark:hover:text-white transition-colors">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-matrimony-600 hover:text-matrimony-700 dark:text-matrimony-300 dark:hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-matrimony-600 hover:text-matrimony-700 dark:text-matrimony-300 dark:hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-matrimony-600 hover:text-matrimony-700 dark:text-matrimony-300 dark:hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-matrimony-600 hover:text-matrimony-700 dark:text-matrimony-300 dark:hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/licenses" className="text-matrimony-600 hover:text-matrimony-700 dark:text-matrimony-300 dark:hover:text-white transition-colors">
                  Licenses
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center text-matrimony-600 dark:text-matrimony-300">
          <p>© {new Date().getFullYear()} Mango Matrimony. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
