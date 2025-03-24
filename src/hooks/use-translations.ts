
import { useState, useEffect } from 'react';

// Translation function
export const useTranslations = () => {
  // Try to get language from localStorage first, default to 'en'
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('app-language') || 'en';
  });

  // Persist language selection to localStorage
  useEffect(() => {
    localStorage.setItem('app-language', currentLanguage);
    // Update html lang attribute for accessibility and SEO
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

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
    'profile_edit_title': {
      'en': 'Edit Your Profile',
      'si': 'ඔබේ ප්‍රොෆයිල් සංස්කරණය කරන්න',
      'ta': 'உங்கள் சுயவிவரத்தைத் திருத்தவும்'
    },
    'profile_edit_subtitle': {
      'en': 'Update your profile information',
      'si': 'ඔබේ ප්‍රොෆයිල් තොරතුරු යාවත්කාලීන කරන්න',
      'ta': 'உங்கள் சுயவிவர தகவலைப் புதுப்பிக்கவும்'
    },
    'navbar.home': {
      'en': 'Home',
      'si': 'මුල් පිටුව',
      'ta': 'முகப்பு'
    },
    'navbar.discover': {
      'en': 'Discover',
      'si': 'සොයාගන්න',
      'ta': 'கண்டுபிடி'
    },
    'navbar.messages': {
      'en': 'Messages',
      'si': 'පණිවිඩ',
      'ta': 'செய்திகள்'
    },
    'navbar.profile': {
      'en': 'Profile',
      'si': 'පැතිකඩ',
      'ta': 'சுயவிவரம்'
    },
    'navbar.howItWorks': {
      'en': 'How It Works',
      'si': 'එය කෙසේ ක්‍රියා කරයිද',
      'ta': 'இது எப்படி செயல்படுகிறது'
    },
    'navbar.successStories': {
      'en': 'Success Stories',
      'si': 'සාර්ථක කතා',
      'ta': 'வெற்றிக் கதைகள்'
    },
    'navbar.matches': {
      'en': 'Matches',
      'si': 'ගැලපීම්',
      'ta': 'பொருத்தங்கள்'
    },
    'navbar.likedYou': {
      'en': 'Liked You',
      'si': 'ඔබට කැමතියි',
      'ta': 'உங்களை விரும்பியவர்கள்'
    },
    'loading': {
      'en': 'Loading...',
      'si': 'පූරණය වෙමින්...',
      'ta': 'ஏற்றுகிறது...'
    },
    'login': {
      'en': 'Login',
      'si': 'පුරන්න',
      'ta': 'உள்நுழைய'
    },
    'register': {
      'en': 'Register',
      'si': 'ලියාපදිංචි වන්න',
      'ta': 'பதிவு செய்யுங்கள்'
    },
    'logout': {
      'en': 'Logout',
      'si': 'පිටවීම',
      'ta': 'வெளியேறு'
    },
    'pricing_monthly': {
      'en': '5,000 LKR',
      'si': 'රු. 5,000',
      'ta': 'ரூ. 5,000'
    },
    'per_month': {
      'en': '/month',
      'si': '/මසකට',
      'ta': '/மாதம்'
    },
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
