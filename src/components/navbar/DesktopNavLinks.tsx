
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations } from '@/hooks/use-translations';
import { cn } from '@/lib/utils';
import { Heart, MessageCircle, Search, ThumbsUp } from 'lucide-react';
import { useMessageRequests } from '@/components/messages/hooks/useMessageRequests';

const DesktopNavLinks: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { translate } = useTranslations();
  const { requests } = useMessageRequests();
  
  const hasPendingRequests = requests.length > 0;

  const navLinkBaseClasses = "transition-colors hover:text-matrimony-600 px-3 py-1.5 text-sm font-medium";
  const navLinkActiveClasses = "text-matrimony-600 dark:text-matrimony-400";
  const navLinkInactiveClasses = "text-gray-700 dark:text-gray-300";
  const navLinkWithIconClasses = "transition-colors hover:text-matrimony-600 px-3 py-1.5 flex items-center gap-1.5 text-sm font-medium";

  return (
    <nav className="ml-6 flex space-x-1">
      <NavLink
        to="/"
        className={({ isActive }) => cn(
          navLinkBaseClasses,
          isActive ? navLinkActiveClasses : navLinkInactiveClasses
        )}
        end
      >
        {translate('navbar.home')}
      </NavLink>
      
      {isAuthenticated ? (
        <>
          <NavLink
            to="/discover"
            className={({ isActive }) => cn(
              navLinkWithIconClasses,
              isActive ? navLinkActiveClasses : navLinkInactiveClasses
            )}
          >
            <Search className="h-4 w-4" />
            {translate('navbar.discover')}
          </NavLink>
          
          <NavLink
            to="/matches"
            className={({ isActive }) => cn(
              navLinkWithIconClasses,
              isActive ? navLinkActiveClasses : navLinkInactiveClasses
            )}
          >
            <Heart className="h-4 w-4" />
            {translate('navbar.matches')}
          </NavLink>
          
          <NavLink
            to="/liked-you"
            className={({ isActive }) => cn(
              navLinkWithIconClasses,
              isActive ? navLinkActiveClasses : navLinkInactiveClasses
            )}
          >
            <ThumbsUp className="h-4 w-4" />
            {translate('navbar.likedYou')}
          </NavLink>
          
          <div className="relative">
            <NavLink
              to="/messages"
              className={({ isActive }) => cn(
                navLinkWithIconClasses,
                isActive ? navLinkActiveClasses : navLinkInactiveClasses
              )}
            >
              <MessageCircle className="h-4 w-4" />
              {translate('navbar.messages')}
            </NavLink>
            {hasPendingRequests && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-matrimony-600 rounded-full"></span>
            )}
          </div>
        </>
      ) : (
        <>
          <NavLink
            to="/how-it-works"
            className={({ isActive }) => cn(
              navLinkBaseClasses,
              isActive ? navLinkActiveClasses : navLinkInactiveClasses
            )}
          >
            {translate('navbar.howItWorks')}
          </NavLink>
          
          <NavLink
            to="/success-stories"
            className={({ isActive }) => cn(
              navLinkBaseClasses,
              isActive ? navLinkActiveClasses : navLinkInactiveClasses
            )}
          >
            {translate('navbar.successStories')}
          </NavLink>
        </>
      )}
    </nav>
  );
};

export default DesktopNavLinks;
