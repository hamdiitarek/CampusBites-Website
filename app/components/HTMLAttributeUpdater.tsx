"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';

const HTMLAttributeUpdater = () => {
  const { language, isRTL } = useLanguage();

  useEffect(() => {
    // Update document direction and language attributes
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Update body class for font switching
    document.body.className = isRTL ? 'font-arabic' : 'font-inter';
  }, [language, isRTL]);

  return null; // This component doesn't render anything
};

export default HTMLAttributeUpdater;
