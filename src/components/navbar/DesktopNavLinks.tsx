
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslations } from '@/hooks/use-translations';

const DesktopNavLinks: React.FC = () => {
  const location = useLocation();
  const { translate } = useTranslations();

  return (
    <nav className="hidden md:flex items-center space-x-8">
      <Link 
        to="/" 
        className={`text-sm font-medium transition-colors hover:text-matrimony-700 ${
          location.pathname === '/' ? 'text-matrimony-700' : 'text-matrimony-600'
        }`}
      >
        {translate('home')}
      </Link>
      <Link 
        to="/discover" 
        className={`text-sm font-medium transition-colors hover:text-matrimony-700 ${
          location.pathname === '/discover' ? 'text-matrimony-700' : 'text-matrimony-600'
        }`}
      >
        {translate('discover')}
      </Link>
      <Link 
        to="/how-it-works" 
        className={`text-sm font-medium transition-colors hover:text-matrimony-700 ${
          location.pathname === '/how-it-works' ? 'text-matrimony-700' : 'text-matrimony-600'
        }`}
      >
        {translate('how_it_works')}
      </Link>
      <Link 
        to="/success-stories" 
        className={`text-sm font-medium transition-colors hover:text-matrimony-700 ${
          location.pathname === '/success-stories' ? 'text-matrimony-700' : 'text-matrimony-600'
        }`}
      >
        {translate('success_stories')}
      </Link>
      <Link 
        to="/messages" 
        className={`text-sm font-medium transition-colors hover:text-matrimony-700 ${
          location.pathname === '/messages' ? 'text-matrimony-700' : 'text-matrimony-600'
        }`}
      >
        {translate('messages')}
      </Link>
    </nav>
  );
};

export default DesktopNavLinks;
