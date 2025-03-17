
import React from 'react';
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSelector from './LanguageSelector';

interface MobileNavbarProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ isMenuOpen, toggleMenu }) => {
  return (
    <div className="flex items-center space-x-2 md:hidden">
      <LanguageSelector isMobile={true} />
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleMenu}
      >
        {isMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};

export default MobileNavbar;
