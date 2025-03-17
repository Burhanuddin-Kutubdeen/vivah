
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Importing our new component files
import Logo from './navbar/Logo';
import DesktopNavLinks from './navbar/DesktopNavLinks';
import LanguageSelector from './navbar/LanguageSelector';
import AuthButtons from './navbar/AuthButtons';
import MobileNavbar from './navbar/MobileNavbar';
import MobileMenu from './navbar/MobileMenu';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

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
        <Logo />

        {/* Desktop Navigation Links */}
        {user && <DesktopNavLinks />}

        {/* Desktop Language Selector + Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <LanguageSelector />
          <AuthButtons />
        </div>

        {/* Mobile Navigation */}
        <MobileNavbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMenuOpen} />
    </header>
  );
};

export default Navbar;
