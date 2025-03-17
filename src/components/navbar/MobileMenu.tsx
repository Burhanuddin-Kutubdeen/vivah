
import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Home, MessageCircle, Search, User, Info, BookHeart, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from '@/hooks/use-translations';
import { useAuth } from '@/contexts/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { isAuthenticated } = useAuth();
  const { translate } = useTranslations();

  const menuVariants = {
    closed: {
      opacity: 0,
      x: '100%',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.div
      initial="closed"
      animate={isOpen ? 'open' : 'closed'}
      variants={menuVariants}
      className="fixed inset-y-0 right-0 w-full max-w-xs bg-white dark:bg-gray-900 z-50 shadow-xl p-4 flex flex-col"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Menu</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Close menu"
        >
          <X size={24} />
        </button>
      </div>

      <nav className="flex flex-col space-y-2">
        <MobileNavLink to="/" icon={<Home size={20} />} onClick={onClose}>
          {translate('navbar.home')}
        </MobileNavLink>
        
        {isAuthenticated && (
          <>
            <MobileNavLink to="/discover" icon={<Search size={20} />} onClick={onClose}>
              {translate('navbar.discover')}
            </MobileNavLink>
            
            <MobileNavLink to="/matches" icon={<Heart size={20} />} onClick={onClose}>
              Matches
            </MobileNavLink>
            
            <MobileNavLink to="/messages" icon={<MessageCircle size={20} />} onClick={onClose}>
              {translate('navbar.messages')}
            </MobileNavLink>
            
            <MobileNavLink to="/profile" icon={<User size={20} />} onClick={onClose}>
              {translate('navbar.profile')}
            </MobileNavLink>
          </>
        )}
        
        <MobileNavLink to="/how-it-works" icon={<Info size={20} />} onClick={onClose}>
          {translate('navbar.howItWorks')}
        </MobileNavLink>
        
        <MobileNavLink to="/success-stories" icon={<BookHeart size={20} />} onClick={onClose}>
          {translate('navbar.successStories')}
        </MobileNavLink>
      </nav>
    </motion.div>
  );
};

interface MobileNavLinkProps {
  to: string;
  icon: React.ReactNode;
  onClick: () => void;
  children: React.ReactNode;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, icon, onClick, children }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      cn(
        'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
        isActive
          ? 'bg-matrimony-50 text-matrimony-900 dark:bg-matrimony-900/20 dark:text-matrimony-50'
          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
      )
    }
  >
    <span className="text-matrimony-600 dark:text-matrimony-400">{icon}</span>
    <span>{children}</span>
  </NavLink>
);

export default MobileMenu;
