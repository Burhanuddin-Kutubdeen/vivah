
import React from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations } from '@/hooks/use-translations';

interface AuthButtonsProps {
  isMobile?: boolean;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ isMobile = false }) => {
  const { user, signOut } = useAuth();
  const { translate } = useTranslations();

  const buttonBaseClass = isMobile 
    ? "w-full justify-center rounded-full font-medium"
    : "rounded-full font-medium px-5 py-2";

  return (
    <div className={isMobile ? "flex flex-col space-y-3" : "flex items-center space-x-4"}>
      {user ? (
        <>
          <Button 
            variant="outline" 
            size={isMobile ? "default" : "sm"}
            className={`${buttonBaseClass} border-matrimony-300 text-matrimony-700 hover:bg-matrimony-50`}
            asChild
          >
            <Link to="/profile">
              <User size={isMobile ? 18 : 16} className="mr-2" />
              {translate('navbar.profile')}
            </Link>
          </Button>
          <Button 
            variant="outline"
            size={isMobile ? "default" : "sm"}
            className={`${buttonBaseClass} border-matrimony-300 text-matrimony-700 hover:bg-matrimony-50`}
            onClick={() => signOut()}
          >
            <LogOut size={isMobile ? 18 : 16} className="mr-2" />
            {translate('logout')}
          </Button>
        </>
      ) : (
        <>
          <Button 
            variant="outline" 
            size={iMobile ? "default" : "sm"}
            className={`${buttonBaseClass} border-matrimony-300 text-matrimony-700 hover:bg-matrimony-50`}
            asChild
          >
            <Link to="/login">{translate('login')}</Link>
          </Button>
          <Button 
            size={iMobile ? "default" : "sm"}
            className={`${buttonBaseClass} bg-matrimony-600 hover:bg-matrimony-700 transition-colors`}
            asChild
          >
            <Link to="/register">{translate('register')}</Link>
          </Button>
        </>
      )}
    </div>
  );
};

export default AuthButtons;
