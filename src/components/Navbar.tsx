
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Search, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-serif font-bold text-matrimony-700 dark:text-white">
          Vivah
        </Link>

        {/* Navigation Links */}
        {user ? (
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink 
              to="/discover" 
              className={({ isActive }) => 
                `flex items-center space-x-2 text-sm font-medium ${
                  isActive ? 'text-matrimony-600 dark:text-matrimony-400' : 'text-gray-600 dark:text-gray-300 hover:text-matrimony-600 dark:hover:text-matrimony-400'
                }`
              }
            >
              <Search className="h-4 w-4" />
              <span>Discover</span>
            </NavLink>
            <NavLink 
              to="/matches" 
              className={({ isActive }) => 
                `flex items-center space-x-2 text-sm font-medium ${
                  isActive ? 'text-matrimony-600 dark:text-matrimony-400' : 'text-gray-600 dark:text-gray-300 hover:text-matrimony-600 dark:hover:text-matrimony-400'
                }`
              }
            >
              <Heart className="h-4 w-4" />
              <span>Matches</span>
            </NavLink>
            <NavLink 
              to="/messages" 
              className={({ isActive }) => 
                `flex items-center space-x-2 text-sm font-medium ${
                  isActive ? 'text-matrimony-600 dark:text-matrimony-400' : 'text-gray-600 dark:text-gray-300 hover:text-matrimony-600 dark:hover:text-matrimony-400'
                }`
              }
            >
              <MessageCircle className="h-4 w-4" />
              <span>Messages</span>
            </NavLink>
            <NavLink 
              to="/profile" 
              className={({ isActive }) => 
                `flex items-center space-x-2 text-sm font-medium ${
                  isActive ? 'text-matrimony-600 dark:text-matrimony-400' : 'text-gray-600 dark:text-gray-300 hover:text-matrimony-600 dark:hover:text-matrimony-400'
                }`
              }
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </NavLink>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center space-x-6">
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
        )}
        
        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                className="rounded-full text-sm font-medium"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Button 
                variant="outline" 
                size="sm"
                className="rounded-full font-medium"
                asChild
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button 
                size="sm"
                className="rounded-full font-medium bg-matrimony-600 hover:bg-matrimony-700 text-white"
                asChild
              >
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
