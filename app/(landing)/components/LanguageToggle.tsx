
"use client";

import { Globe, Languages } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageToggle = () => {
  const { language, setLanguage, isRTL } = useLanguage();

  return (
    <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
      <Languages className="w-4 h-4 text-gray-600" />
      <div className="relative flex bg-gray-100 rounded-full p-1 shadow-inner">
        {/* Background slider */}
        <div 
          className={`absolute top-1 bottom-1 w-1/2 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out ${
            isRTL 
              ? (language === 'ar' ? 'translate-x-0' : 'translate-x-full')
              : (language === 'ar' ? 'translate-x-full' : 'translate-x-0')
          }`}
        />
        
        {/* Language Buttons - order changes based on RTL */}
        {isRTL ? (
          <>
            {/* Arabic Button (first in RTL) */}
            <button
              onClick={() => setLanguage('ar')}
              className={`relative z-10 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 min-w-[50px] ${
                language === 'ar'
                  ? 'text-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-label="التبديل إلى العربية"
            >
              ع
            </button>
            
            {/* English Button (second in RTL) */}
            <button
              onClick={() => setLanguage('en')}
              className={`relative z-10 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 min-w-[50px] ${
                language === 'en'
                  ? 'text-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-label="Switch to English"
            >
              EN
            </button>
          </>
        ) : (
          <>
            {/* English Button (first in LTR) */}
            <button
              onClick={() => setLanguage('en')}
              className={`relative z-10 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 min-w-[50px] ${
                language === 'en'
                  ? 'text-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-label="Switch to English"
            >
              EN
            </button>
            
            {/* Arabic Button (second in LTR) */}
            <button
              onClick={() => setLanguage('ar')}
              className={`relative z-10 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 min-w-[50px] ${
                language === 'ar'
                  ? 'text-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-label="التبديل إلى العربية"
            >
              ع
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LanguageToggle;
