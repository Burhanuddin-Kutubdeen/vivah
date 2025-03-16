
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Available languages
const languages = [
  { code: 'en', label: 'English' },
  { code: 'si', label: 'සිංහල' },
  { code: 'ta', label: 'தமிழ்' }
];

interface LanguageSelectorProps {
  currentLanguage: string;
  setCurrentLanguage: (code: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  currentLanguage, 
  setCurrentLanguage 
}) => {
  return (
    <div className="absolute top-4 right-4 z-10">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            {languages.find(lang => lang.code === currentLanguage)?.label || 'Language'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {languages.map(lang => (
            <DropdownMenuItem 
              key={lang.code}
              onClick={() => setCurrentLanguage(lang.code)}
              className={currentLanguage === lang.code ? "bg-matrimony-50 font-semibold" : ""}
            >
              {lang.label}
              {currentLanguage === lang.code && <Check className="ml-2 h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageSelector;
