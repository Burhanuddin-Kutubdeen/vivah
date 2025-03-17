
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations } from '@/hooks/use-translations';

interface MobileMenuProps {
  isOpen: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen }) => {
  const { user, signOut } = useAuth();
  const { translate } = useTranslations();

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 z-40 bg-white dark:bg-gray-900 pt-20">
      <nav className="container mx-auto px-4 py-5 flex flex-col space-y-5">
        <Link 
          to="/" 
          className="text-xl font-medium py-2 border-b border-gray-100 dark:border-gray-800"
        >
          {translate('home')}
        </Link>
        <Link 
          to="/discover" 
          className="text-xl font-medium py-2 border-b border-gray-100 dark:border-gray-800"
        >
          {translate('discover')}
        </Link>
        <Link 
          to="/how-it-works" 
          className="text-xl font-medium py-2 border-b border-gray-100 dark:border-gray-800"
        >
          {translate('how_it_works')}
        </Link>
        <Link 
          to="/success-stories" 
          className="text-xl font-medium py-2 border-b border-gray-100 dark:border-gray-800"
        >
          {translate('success_stories')}
        </Link>
        {user && (
          <Link 
            to="/messages" 
            className="text-xl font-medium py-2 border-b border-gray-100 dark:border-gray-800"
          >
            <span className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              {translate('messages')}
            </span>
          </Link>
        )}
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
                  {translate('profile')}
                </Link>
              </Button>
              <Button 
                variant="outline"
                className="w-full justify-center rounded-full font-medium border-matrimony-300 text-matrimony-700"
                onClick={() => signOut()}
              >
                <LogOut size={18} className="mr-2" />
                {translate('logout')}
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="w-full justify-center rounded-full font-medium border-matrimony-300 text-matrimony-700"
                asChild
              >
                <Link to="/login">{translate('login')}</Link>
              </Button>
              <Button 
                className="w-full justify-center rounded-full font-medium bg-matrimony-600 hover:bg-matrimony-700"
                asChild
              >
                <Link to="/register">{translate('register')}</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default MobileMenu;
