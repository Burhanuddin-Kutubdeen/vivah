
import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Home, MessageCircle, Search, Info, BookHeart, X, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from '@/hooks/use-translations';
import { useAuth } from '@/contexts/AuthContext';
import { useMessageRequests } from '@/components/messages/hooks/useMessageRequests';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { isAuthenticated } = useAuth();
  const { translate } = useTranslations();
  const { requests } = useMessageRequests();
  
  const hasPendingRequests = requests.length > 0;

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
        <h2 className="text-xl font-serif font-bold text-matrimony-700 dark:text-matrimony-300">Menu</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-matrimony-50 dark:hover:bg-matrimony-900/20 text-matrimony-700 dark:text-matrimony-300 transition-colors"
          aria-label="Close menu"
        >
          <X size={24} />
        </button>
      </div>

      <nav className="flex flex-col space-y-2">
        <MobileNavLink to="/" icon={<Home size={20} />} onClick={onClose}>
          {translate('navbar.home')}
        </MobileNavLink>
        
        {isAuthenticated ? (
          <>
            <MobileNavLink to="/discover" icon={<Search size={20} />} onClick={onClose}>
              {translate('navbar.discover')}
            </MobileNavLink>
            
            <MobileNavLink to="/matches" icon={<Heart size={20} />} onClick={onClose}>
              {translate('navbar.matches')}
            </MobileNavLink>
            
            <MobileNavLink to="/liked-you" icon={<ThumbsUp size={20} />} onClick={onClose}>
              {translate('navbar.likedYou')}
            </MobileNavLink>
            
            <MobileNavLink 
              to="/messages" 
              icon={<MessageCircle size={20} />} 
              onClick={onClose}
              hasBadge={hasPendingRequests}
            >
              {translate('navbar.messages')}
            </MobileNavLink>
          </>
        ) : (
          <>
            <MobileNavLink to="/how-it-works" icon={<Info size={20} />} onClick={onClose}>
              {translate('navbar.howItWorks')}
            </MobileNavLink>
            
            <MobileNavLink to="/success-stories" icon={<BookHeart size={20} />} onClick={onClose}>
              {translate('navbar.successStories')}
            </MobileNavLink>
          </>
        )}
      </nav>
    </motion.div>
  );
};

interface MobileNavLinkProps {
  to: string;
  icon: React.ReactNode;
  onClick: () => void;
  children: React.ReactNode;
  hasBadge?: boolean;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, icon, onClick, children, hasBadge }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      cn(
        'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors relative',
        isActive
          ? 'bg-matrimony-50 text-matrimony-700 dark:bg-matrimony-900/20 dark:text-matrimony-300'
          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
      )
    }
  >
    <span className="text-matrimony-600 dark:text-matrimony-400">{icon}</span>
    <span>{children}</span>
    {hasBadge && (
      <span className="absolute top-3 right-4 w-2 h-2 bg-matrimony-600 rounded-full"></span>
    )}
  </NavLink>
);

export default MobileMenu;
