
import React, { createContext, useContext, useState } from 'react';

interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

const translations: Translations = {
  // Header
  features: { en: "Features", ar: "الميزات" },
  forYou: { en: "For You", ar: "لك" },
  reviews: { en: "Reviews", ar: "التقييمات" },
  pricing: { en: "Pricing", ar: "الأسعار" },
  signIn: { en: "Sign In", ar: "تسجيل الدخول" },
  getStarted: { en: "Get Started", ar: "ابدأ الآن" },
  
  // Hero
  trustedBy: { en: "Trusted by 10,000+ students", ar: "موثوق من قِبل أكثر من 10,000 طالب" },
  connectLearnSucceed: { en: "Connect. Learn. Succeed.", ar: "تواصل. تعلم. انجح." },
  heroSubtitle: { 
    en: "The ultimate platform connecting students, vendors, and administrators. Streamline your academic journey with powerful tools and seamless collaboration.",
    ar: "المنصة الأمثل لربط الطلاب والموردين والإداريين. اجعل رحلتك الأكاديمية أكثر سلاسة بأدوات قوية وتعاون سلس."
  },
  downloadApp: { en: "Download App", ar: "تحميل التطبيق" },
  watchDemo: { en: "Watch Demo", ar: "شاهد العرض التوضيحي" },
  
  // App mockup content
  dashboard: { en: "Dashboard", ar: "لوحة التحكم" },
  courses: { en: "My Courses", ar: "دوراتي" },
  assignments: { en: "Assignments", ar: "المهام" },
  messages: { en: "Messages", ar: "الرسائل" },
  profile: { en: "Profile", ar: "الملف الشخصي" },
  mathematics: { en: "Mathematics 101", ar: "الرياضيات 101" },
  physicsLab: { en: "Physics Lab", ar: "مختبر الفيزياء" },
  computerScience: { en: "Computer Science", ar: "علوم الحاسوب" },
  dueToday: { en: "Due Today", ar: "مستحق اليوم" },
  newMessage: { en: "New message from Prof. Smith", ar: "رسالة جديدة من الأستاذ سميث" },
  
  // Features
  whyChoose: { en: "Why Choose StudyConnect?", ar: "لماذا تختار StudyConnect؟" },
  featuresSubtitle: { 
    en: "Discover the features that make our platform the perfect choice for modern education.",
    ar: "اكتشف الميزات التي تجعل منصتنا الخيار الأمثل للتعليم الحديث."
  }
};

interface LanguageContextType {
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-arabic' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
