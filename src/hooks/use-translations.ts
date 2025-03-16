
import { useState } from 'react';

// Translation function (simplified for demonstration)
export const useTranslations = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const translations: Record<string, Record<string, string>> = {
    'profile_setup_title': {
      'en': 'Complete Your Profile',
      'si': 'ඔබේ ප්‍රොෆයිල් සම්පූර්ණ කරන්න',
      'ta': 'உங்கள் சுயவிவரத்தை பூர்த்தி செய்யுங்கள்'
    },
    'profile_setup_subtitle': {
      'en': 'Tell us more about yourself to help find your perfect match',
      'si': 'ඔබේ පරිපූර්ණ ගැලපීම සොයා ගැනීමට උදව් කිරීමට ඔබ ගැන තවත් අපට කියන්න',
      'ta': 'உங்களின் சரியான பொருத்தத்தைக் கண்டுபிடிக்க உதவ உங்களைப் பற்றி மேலும் எங்களுக்குச் சொல்லுங்கள்'
    },
    // Add more translations as needed
  };

  const translate = (key: string) => {
    return translations[key]?.[currentLanguage] || translations[key]?.['en'] || key;
  };

  return {
    currentLanguage,
    setCurrentLanguage,
    translate
  };
};
