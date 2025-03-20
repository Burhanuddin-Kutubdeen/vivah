
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations } from '@/hooks/use-translations';
import { cn } from '@/lib/utils';
import { Heart, MessageCircle, Search, User, ThumbsUp } from 'lucide-react';

interface NavLinkProps {
  to: string;
  isActive: boolean;
  children: React.ReactNode;
}

const StyledNavLink: React.FC<NavLinkProps> = ({ to, isActive, children }) => (
  <NavLink
    to={to}
    className={cn(
      "transition-colors hover:text-primary px-3 py-1.5 flex items-center gap-1.5 text-sm font-medium",
      isActive ? "text-primary dark:text-primary" : "text-gray-700 dark:text-gray-300"
    )}
  >
    {children}
  </NavLink>
);

const DesktopNavLinks: React.FC = () => {
  const { isAuthenticated, isProfileComplete } = useAuth();
  const { translate } = useTranslations();

  return (
    <nav className="ml-6 flex space-x-1">
      <NavLink
        to="/"
        className={({ isActive }) => cn(
          "transition-colors hover:text-primary px-3 py-1.5 text-sm font-medium",
          isActive ? "text-primary dark:text-primary" : "text-gray-700 dark:text-gray-300"
        )}
        end
      >
        {translate('navbar.home')}
      </NavLink>
      
      {isAuthenticated && (
        <>
          <NavLink
            to="/discover"
            className={({ isActive }) => cn(
              "transition-colors hover:text-primary px-3 py-1.5 flex items-center gap-1.5 text-sm font-medium",
              isActive ? "text-primary dark:text-primary" : "text-gray-700 dark:text-gray-300"
            )}
          >
            <Search className="h-4 w-4" />
            {translate('navbar.discover')}
          </NavLink>
          
          <NavLink
            to="/matches"
            className={({ isActive }) => cn(
              "transition-colors hover:text-primary px-3 py-1.5 flex items-center gap-1.5 text-sm font-medium",
              isActive ? "text-primary dark:text-primary" : "text-gray-700 dark:text-gray-300"
            )}
          >
            <Heart className="h-4 w-4" />
            Matches
          </NavLink>
          
          <NavLink
            to="/liked-you"
            className={({ isActive }) => cn(
              "transition-colors hover:text-primary px-3 py-1.5 flex items-center gap-1.5 text-sm font-medium",
              isActive ? "text-primary dark:text-primary" : "text-gray-700 dark:text-gray-300"
            )}
          >
            <ThumbsUp className="h-4 w-4" />
            Liked You
          </NavLink>
          
          <NavLink
            to="/messages"
            className={({ isActive }) => cn(
              "transition-colors hover:text-primary px-3 py-1.5 flex items-center gap-1.5 text-sm font-medium",
              isActive ? "text-primary dark:text-primary" : "text-gray-700 dark:text-gray-300"
            )}
          >
            <MessageCircle className="h-4 w-4" />
            {translate('navbar.messages')}
          </NavLink>
          
          <NavLink
            to="/profile"
            className={({ isActive }) => cn(
              "transition-colors hover:text-primary px-3 py-1.5 flex items-center gap-1.5 text-sm font-medium",
              isActive ? "text-primary dark:text-primary" : "text-gray-700 dark:text-gray-300"
            )}
          >
            <User className="h-4 w-4" />
            {translate('navbar.profile')}
          </NavLink>
        </>
      )}
      
      <NavLink
        to="/how-it-works"
        className={({ isActive }) => cn(
          "transition-colors hover:text-primary px-3 py-1.5 text-sm font-medium",
          isActive ? "text-primary dark:text-primary" : "text-gray-700 dark:text-gray-300"
        )}
      >
        {translate('navbar.howItWorks')}
      </NavLink>
      
      <NavLink
        to="/success-stories"
        className={({ isActive }) => cn(
          "transition-colors hover:text-primary px-3 py-1.5 text-sm font-medium",
          isActive ? "text-primary dark:text-primary" : "text-gray-700 dark:text-gray-300"
        )}
      >
        {translate('navbar.successStories')}
      </NavLink>
    </nav>
  );
};

export default DesktopNavLinks;
