
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, User, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const NavigationItems = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <div className="flex items-center space-x-1">
      <NavLink
        to="/discover"
        className={({ isActive }) =>
          cn(
            "px-3 py-2 rounded-md text-sm font-medium transition-colors",
            isActive
              ? "bg-matrimony-100 text-matrimony-900 dark:bg-matrimony-900/20 dark:text-matrimony-50"
              : "text-matrimony-700 hover:bg-matrimony-100 dark:text-matrimony-300 dark:hover:bg-matrimony-900/20"
          )
        }
      >
        <span className="flex items-center">
          <Heart className="h-4 w-4 mr-1.5" />
          Discover
        </span>
      </NavLink>
      
      <NavLink
        to="/messages"
        className={({ isActive }) =>
          cn(
            "px-3 py-2 rounded-md text-sm font-medium transition-colors",
            isActive
              ? "bg-matrimony-100 text-matrimony-900 dark:bg-matrimony-900/20 dark:text-matrimony-50"
              : "text-matrimony-700 hover:bg-matrimony-100 dark:text-matrimony-300 dark:hover:bg-matrimony-900/20"
          )
        }
      >
        <span className="flex items-center">
          <MessageCircle className="h-4 w-4 mr-1.5" />
          Messages
        </span>
      </NavLink>
      
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          cn(
            "px-3 py-2 rounded-md text-sm font-medium transition-colors",
            isActive
              ? "bg-matrimony-100 text-matrimony-900 dark:bg-matrimony-900/20 dark:text-matrimony-50"
              : "text-matrimony-700 hover:bg-matrimony-100 dark:text-matrimony-300 dark:hover:bg-matrimony-900/20"
          )
        }
      >
        <span className="flex items-center">
          <User className="h-4 w-4 mr-1.5" />
          Profile
        </span>
      </NavLink>
    </div>
  );
};

export default NavigationItems;
