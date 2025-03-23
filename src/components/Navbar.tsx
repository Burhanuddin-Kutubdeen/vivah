
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import LanguageSelector from '@/components/navbar/LanguageSelector';
import AuthButtons from '@/components/navbar/AuthButtons';

const Navbar: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-serif font-bold text-matrimony-700 dark:text-white">
          Vivah
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `text-sm font-medium ${
                isActive ? 'text-matrimony-600 dark:text-matrimony-400' : 'text-gray-600 dark:text-gray-300 hover:text-matrimony-600 dark:hover:text-matrimony-400'
              }`
            }
            end
          >
            Home
          </NavLink>
          <NavLink 
            to="/discover" 
            className={({ isActive }) => 
              `text-sm font-medium ${
                isActive ? 'text-matrimony-600 dark:text-matrimony-400' : 'text-gray-600 dark:text-gray-300 hover:text-matrimony-600 dark:hover:text-matrimony-400'
              }`
            }
          >
            Discover
          </NavLink>
          {user && (
            <>
              <NavLink 
                to="/liked-you" 
                className={({ isActive }) => 
                  `text-sm font-medium ${
                    isActive ? 'text-matrimony-600 dark:text-matrimony-400' : 'text-gray-600 dark:text-gray-300 hover:text-matrimony-600 dark:hover:text-matrimony-400'
                  }`
                }
              >
                Liked You
              </NavLink>
              <NavLink 
                to="/messages" 
                className={({ isActive }) => 
                  `text-sm font-medium ${
                    isActive ? 'text-matrimony-600 dark:text-matrimony-400' : 'text-gray-600 dark:text-gray-300 hover:text-matrimony-600 dark:hover:text-matrimony-400'
                  }`
                }
              >
                Messages
              </NavLink>
            </>
          )}
          <NavLink 
            to="/how-it-works" 
            className={({ isActive }) => 
              `text-sm font-medium ${
                isActive ? 'text-matrimony-600 dark:text-matrimony-400' : 'text-gray-600 dark:text-gray-300 hover:text-matrimony-600 dark:hover:text-matrimony-400'
              }`
            }
          >
            How It Works
          </NavLink>
          <NavLink 
            to="/success-stories" 
            className={({ isActive }) => 
              `text-sm font-medium ${
                isActive ? 'text-matrimony-600 dark:text-matrimony-400' : 'text-gray-600 dark:text-gray-300 hover:text-matrimony-600 dark:hover:text-matrimony-400'
              }`
            }
          >
            Success Stories
          </NavLink>
        </nav>
        
        {/* Auth Buttons and Language Selector */}
        <div className="flex items-center space-x-4">
          <LanguageSelector />
          <AuthButtons />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
