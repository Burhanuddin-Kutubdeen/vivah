
import React from 'react';
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from '@/hooks/use-translations';

// Available languages
const languages = [
  { code: 'en', label: 'English' },
  { code: 'si', label: 'සිංහල' },
  { code: 'ta', label: 'தமிழ்' }
];

interface LanguageSelectorProps {
  isMobile?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ isMobile = false }) => {
  const { currentLanguage, setCurrentLanguage } = useTranslations();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="px-2 text-matrimony-600 hover:bg-matrimony-50 dark:hover:bg-matrimony-900/20 dark:text-matrimony-300"
        >
          <Globe className="h-4 w-4 mr-1" />
          <span className={isMobile ? "sr-only" : "sr-only md:not-sr-only md:inline-block font-medium text-sm"}>
            {languages.find(lang => lang.code === currentLanguage)?.label}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map(lang => (
          <DropdownMenuItem 
            key={lang.code}
            onClick={() => setCurrentLanguage(lang.code)}
            className="cursor-pointer font-medium"
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
