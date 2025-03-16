
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm' : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2"
        >
          <span className="text-2xl font-serif font-bold text-matrimony-700">
            Vivah
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors hover:text-matrimony-700 ${
              location.pathname === '/' ? 'text-matrimony-700' : 'text-matrimony-600'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/discover" 
            className={`text-sm font-medium transition-colors hover:text-matrimony-700 ${
              location.pathname === '/discover' ? 'text-matrimony-700' : 'text-matrimony-600'
            }`}
          >
            Discover
          </Link>
          <Link 
            to="/how-it-works" 
            className={`text-sm font-medium transition-colors hover:text-matrimony-700 ${
              location.pathname === '/how-it-works' ? 'text-matrimony-700' : 'text-matrimony-600'
            }`}
          >
            How It Works
          </Link>
          <Link 
            to="/success-stories" 
            className={`text-sm font-medium transition-colors hover:text-matrimony-700 ${
              location.pathname === '/success-stories' ? 'text-matrimony-700' : 'text-matrimony-600'
            }`}
          >
            Success Stories
          </Link>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full font-medium px-5 py-2 border-matrimony-300 text-matrimony-700 hover:bg-matrimony-50"
                asChild
              >
                <Link to="/profile">
                  <User size={16} className="mr-2" />
                  Profile
                </Link>
              </Button>
              <Button 
                variant="outline"
                size="sm" 
                className="rounded-full font-medium px-5 py-2 border-matrimony-300 text-matrimony-700 hover:bg-matrimony-50"
                onClick={() => signOut()}
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full font-medium px-5 py-2 border-matrimony-300 text-matrimony-700 hover:bg-matrimony-50"
                asChild
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button 
                size="sm" 
                className="rounded-full font-medium px-5 py-2 bg-matrimony-600 hover:bg-matrimony-700 transition-colors"
                asChild
              >
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white dark:bg-gray-900 pt-20">
          <nav className="container mx-auto px-4 py-5 flex flex-col space-y-5">
            <Link 
              to="/" 
              className="text-xl font-medium py-2 border-b border-gray-100 dark:border-gray-800"
            >
              Home
            </Link>
            <Link 
              to="/discover" 
              className="text-xl font-medium py-2 border-b border-gray-100 dark:border-gray-800"
            >
              Discover
            </Link>
            <Link 
              to="/how-it-works" 
              className="text-xl font-medium py-2 border-b border-gray-100 dark:border-gray-800"
            >
              How It Works
            </Link>
            <Link 
              to="/success-stories" 
              className="text-xl font-medium py-2 border-b border-gray-100 dark:border-gray-800"
            >
              Success Stories
            </Link>
            <div className="flex flex-col space-y-3 pt-5">
              {user ? (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full justify-center rounded-full font-medium border-matrimony-300 text-matrimony-700"
                    asChild
                  >
                    <Link to="/profile">
                      <User size={18} className="mr-2" />
                      Profile
                    </Link>
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full justify-center rounded-full font-medium border-matrimony-300 text-matrimony-700"
                    onClick={() => signOut()}
                  >
                    <LogOut size={18} className="mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full justify-center rounded-full font-medium border-matrimony-300 text-matrimony-700"
                    asChild
                  >
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button 
                    className="w-full justify-center rounded-full font-medium bg-matrimony-600 hover:bg-matrimony-700"
                    asChild
                  >
                    <Link to="/register">Register</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
