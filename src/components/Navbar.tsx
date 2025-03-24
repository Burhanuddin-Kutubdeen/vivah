
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import LanguageSelector from '@/components/navbar/LanguageSelector';
import AuthButtons from '@/components/navbar/AuthButtons';
import { Menu } from 'lucide-react';
import MobileMenu from './navbar/MobileMenu';
import DesktopNavLinks from './navbar/DesktopNavLinks';

const Navbar: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-serif font-bold text-matrimony-700 dark:text-white">
          Vivah
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          <DesktopNavLinks />
        </div>
        
        {/* Auth Buttons and Language Selector */}
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="hidden sm:block">
            <LanguageSelector />
          </div>
          <AuthButtons />
          
          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </header>
  );
};

export default Navbar;
