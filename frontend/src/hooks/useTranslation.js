'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import translations from '@/utils/translations';

export default function useTranslation() {
  const { language } = useLanguage();
  
  const t = (key) => {
    if (!translations[language]) {
      console.warn(`Translation for language "${language}" not found`);
      return key;
    }
    
    if (!translations[language][key]) {
      console.warn(`Translation key "${key}" not found for language "${language}"`);
      return key;
    }
    
    return translations[language][key];
  };
  
  return { t };
}
