"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useRef } from 'react';

const HTMLAttributeUpdater = () => {
  const { language, isRTL } = useLanguage();
  const prevLanguageRef = useRef<string>();

  useEffect(() => {
    // Only update when language actually changes (not on initial mount)
    if (prevLanguageRef.current && prevLanguageRef.current !== language) {
      const expectedDir = isRTL ? 'rtl' : 'ltr';
      const expectedBodyClass = isRTL ? 'font-arabic' : 'font-inter';
      
      // Update document attributes
      document.documentElement.dir = expectedDir;
      document.documentElement.lang = language;
      document.body.className = expectedBodyClass;
    }
    
    // Update the previous language reference
    prevLanguageRef.current = language;
  }, [language, isRTL]);

  return null;
};

export default HTMLAttributeUpdater;


