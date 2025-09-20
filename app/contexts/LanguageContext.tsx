'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

// Organized translations by sections for better maintainability
const translations: Translations = {
  // Header
  features: { en: "Features", ar: "الميزات" },
  forYou: { en: "For You", ar: "لك" },
  reviews: { en: "Reviews", ar: "التقييمات" },
  pricing: { en: "Pricing", ar: "الأسعار" },
  signIn: { en: "Sign In", ar: "تسجيل الدخول" },
  getStarted: { en: "Get Started", ar: "ابدأ الآن" },
  
  // Hero
  trustedBy: { 
    en: "Trusted by 50,000+ Egyptian Students 🇪🇬", 
    ar: "يثق به أكثر من 50,000 طالب مصري 🇪🇬" 
  },
  heroTitle: { 
    en: "CampusBites", 
    ar: "كامبوس بايتس" 
  },
  heroSubtitle: { 
    en: "Egypt's #1 Campus Food Delivery 🚀", 
    ar: "تطبيق توصيل الطعام الجامعي الأول في مصر 🚀" 
  },
  heroDescription: { 
    en: "Order delicious meals from your university cafeterias, canteens, and restaurants. Lightning-fast delivery to Egyptian university campuses in Cairo, Alexandria & beyond. Student discounts, fresh food, unbeatable convenience!",
    ar: "اطلب أكلك المفضل من كانتين وكافيتيريا ومطاعم جامعتك 🍕 توصيل سريع للجامعات المصرية في القاهرة والإسكندرية وكل مكان. خصومات للطلاب، أكل طازج، وسهولة ما لهاش حل!"
  },
  downloadApp: { 
    en: "Download App Free", 
    ar: "حمل التطبيق مجاناً" 
  },
  browseMenus: { 
    en: "Browse Campus Menus", 
    ar: "تصفح قوائم الجامعة" 
  },
  
  // App mockup content
  dashboard: { en: "Dashboard", ar: "لوحة التحكم" },
  myOrders: { en: "My Orders", ar: "طلباتي" },
  favorites: { en: "Favorites", ar: "المفضلة" },
  messages: { en: "Messages", ar: "الرسائل" },
  profile: { en: "Profile", ar: "الملف الشخصي" },
  pizzaHut: { en: "Pizza Hut Express", ar: "بيتزا هت إكسبريس" },
  mcdonalds: { en: "McDonald's Campus", ar: "ماكدونالدز الحرم الجامعي" },
  subwayStation: { en: "Subway Station", ar: "محطة صب واي" },
  orderReady: { en: "Order Ready for Pickup", ar: "الطلب جاهز للاستلام" },
  newPromo: { en: "New promotion available!", ar: "عرض جديد متاح!" },
  
  // Features
  whyChoose: { en: "Why Choose CampusBites?", ar: "لماذا تختار كامبوس بايتس؟" },
  featuresSubtitle: { 
    en: "Discover the features that make our platform the perfect choice for campus dining.",
    ar: "اكتشف الميزات التي تجعل منصتنا الخيار الأمثل لتناول الطعام في الحرم الجامعي."
  },
  realTimeTracking: { en: "Real-Time Tracking", ar: "تتبع فوري" },
  realTimeTrackingDesc: { en: "Track your order from preparation to delivery with live updates", ar: "تتبع طلبك من التحضير إلى التوصيل مع التحديثات المباشرة" },
  campusOptimized: { en: "Campus Optimized", ar: "محسن للحرم الجامعي" },
  campusOptimizedDesc: { en: "Designed specifically for university campuses with accurate location mapping", ar: "مصمم خصيصاً للحرم الجامعي مع رسم خرائط دقيق للمواقع" },
  quickDelivery: { en: "Quick Delivery", ar: "توصيل سريع" },
  quickDeliveryDesc: { en: "Fast delivery to dorms, libraries, and study areas across campus", ar: "توصيل سريع إلى السكنات والمكتبات ومناطق الدراسة في الحرم الجامعي" },
  studentDeals: { en: "Student Deals", ar: "عروض طلابية" },
  studentDealsDesc: { en: "Exclusive discounts and promotions designed for student budgets", ar: "خصومات وعروض حصرية مصممة لميزانيات الطلاب" },
  multiplePayments: { en: "Multiple Payment Options", ar: "خيارات دفع متعددة" },
  multiplePaymentsDesc: { en: "Pay with cards, campus meal plans, or digital wallets", ar: "ادفع بالبطاقات أو خطط وجبات الحرم الجامعي أو المحافظ الرقمية" },
  pushNotifications: { en: "Smart Notifications", ar: "إشعارات ذكية" },
  pushNotificationsDesc: { en: "Stay updated with order status and special offers", ar: "ابق محدثاً بحالة الطلب والعروض الخاصة" },
  
  // Role Section
  builtForEveryone: { en: "Built for Campus Community", ar: "مصمم لمجتمع الحرم الجامعي" },
  builtForEveryoneDesc: { en: "Whether you're a student, food vendor, or administrator, CampusBites has features tailored for your campus dining needs.", ar: "سواء كنت طالباً أو مورد طعام أو مديراً، فإن كامبوس بايتس يحتوي على ميزات مصممة خصيصاً لاحتياجات تناول الطعام في الحرم الجامعي." },
  students: { en: "Students", ar: "الطلاب" },
  studentsSubtitle: { en: "Convenient Campus Dining", ar: "تناول طعام مريح في الحرم الجامعي" },
  studentsDesc: { en: "Browse menus from campus vendors, place orders, and get food delivered to your location without leaving your study spot.", ar: "تصفح قوائم موردي الحرم الجامعي واطلب الطعام واحصل على التوصيل إلى موقعك دون ترك مكان دراستك." },
  vendors: { en: "Food Vendors", ar: "موردو الطعام" },
  vendorsSubtitle: { en: "Expand Your Campus Reach", ar: "وسع نطاق وصولك في الحرم الجامعي" },
  vendorsDesc: { en: "Manage your menu, receive orders in real-time, and serve more students across campus with our vendor dashboard.", ar: "أدر قائمتك واستلم الطلبات في الوقت الفعلي وخدم المزيد من الطلاب في الحرم الجامعي باستخدام لوحة تحكم المورد." },
  administrators: { en: "Campus Admins", ar: "مديرو الحرم الجامعي" },
  administratorsSubtitle: { en: "Streamlined Campus Operations", ar: "عمليات حرم جامعي مبسطة" },
  administratorsDesc: { en: "Oversee platform operations, manage vendor partnerships, and maintain quality standards across campus dining services.", ar: "أشرف على عمليات المنصة وأدر شراكات الموردين وحافظ على معايير الجودة في جميع خدمات تناول الطعام في الحرم الجامعي." },
  browseMenus2: { en: "Browse Menus", ar: "تصفح القوائم" },
  browseMenusDesc: { en: "Explore diverse food options from campus vendors", ar: "استكشف خيارات الطعام المتنوعة من موردي الحرم الجامعي" },
  placeOrders: { en: "Place Orders", ar: "اطلب الآن" },
  placeOrdersDesc: { en: "Order your favorite meals with just a few taps", ar: "اطلب وجباتك المفضلة ببضع نقرات فقط" },
  trackDelivery: { en: "Track Delivery", ar: "تتبع التوصيل" },
  trackDeliveryDesc: { en: "Follow your order in real-time until it reaches you", ar: "تابع طلبك في الوقت الفعلي حتى يصل إليك" },
  manageMenu: { en: "Manage Menu", ar: "إدارة القائمة" },
  manageMenuDesc: { en: "Update your offerings and pricing in real-time", ar: "حدث عروضك وأسعارك في الوقت الفعلي" },
  receiveOrders: { en: "Receive Orders", ar: "استلم الطلبات" },
  receiveOrdersDesc: { en: "Get instant notifications for new orders", ar: "احصل على إشعارات فورية للطلبات الجديدة" },
  trackSales: { en: "Track Sales", ar: "تتبع المبيعات" },
  trackSalesDesc: { en: "Monitor your performance with detailed analytics", ar: "راقب أداءك بتحليلات مفصلة" },
  overseeOperations: { en: "Oversee Operations", ar: "أشرف على العمليات" },
  overseeOperationsDesc: { en: "Monitor platform activity and performance", ar: "راقب نشاط المنصة والأداء" },
  manageVendors: { en: "Manage Vendors", ar: "إدارة الموردين" },
  manageVendorsDesc: { en: "Approve and manage food vendor partnerships", ar: "وافق على شراكات موردي الطعام وأدرها" },
  qualityControl: { en: "Quality Control", ar: "مراقبة الجودة" },
  qualityControlDesc: { en: "Maintain high standards across all campus dining", ar: "حافظ على معايير عالية في جميع خدمات تناول الطعام في الحرم الجامعي" },
  learnMore: { en: "Learn More", ar: "تعلم المزيد" },
  
  // Testimonials
  lovedByThousands: { en: "Loved by Campus Community", ar: "محبوب من مجتمع الحرم الجامعي" },
  testimonialsSubtitle: { en: "See what students, vendors, and administrators say about CampusBites.", ar: "انظر ما يقوله الطلاب والموردين والمديرون عن كامبوس بايتس." },
  lovedByThousandsDesc: { en: "See what students, vendors, and administrators say about CampusBites.", ar: "انظر ما يقوله الطلاب والموردين والمديرون عن كامبوس بايتس." },
  student: { en: "Student", ar: "طالب" },
  foodVendor: { en: "Food Vendor", ar: "مورد طعام" },
  campusAdmin: { en: "Campus Administrator", ar: "مدير حرم جامعي" },
  testimonial1: { en: "CampusBites made campus dining so much easier! I can order from my favorite spots without leaving the library during finals week.", ar: "جعل كامبوس بايتس تناول الطعام في الحرم الجامعي أسهل بكثير! يمكنني الطلب من أماكني المفضلة دون ترك المكتبة خلال أسبوع الامتحانات النهائية." },
  testimonial1Role: { en: "Student", ar: "طالبة" },
  testimonial1Content: { en: "CampusBites made campus dining so much easier! I can order from my favorite spots without leaving the library during finals week.", ar: "جعل كامبوس بايتس تناول الطعام في الحرم الجامعي أسهل بكثير! يمكنني الطلب من أماكني المفضلة دون ترك المكتبة خلال أسبوع الامتحانات النهائية." },
  testimonial2: { en: "Our sales increased by 40% since joining CampusBites. The real-time order management is fantastic for our busy kitchen.", ar: "ازدادت مبيعاتنا بنسبة 40% منذ انضمامنا لكامبوس بايتس. إدارة الطلبات في الوقت الفعلي رائعة لمطبخنا المزدحم." },
  testimonial2Role: { en: "Food Vendor", ar: "مورد طعام" },
  testimonial2Content: { en: "Our sales increased by 40% since joining CampusBites. The real-time order management is fantastic for our busy kitchen.", ar: "ازدادت مبيعاتنا بنسبة 40% منذ انضمامنا لكامبوس بايتس. إدارة الطلبات في الوقت الفعلي رائعة لمطبخنا المزدحم." },
  testimonial3: { en: "CampusBites has streamlined our campus dining operations. The admin dashboard gives us complete oversight of food services.", ar: "قام كامبوس بايتس بتبسيط عمليات تناول الطعام في الحرم الجامعي. تمنحنا لوحة التحكم الإدارية إشرافاً كاملاً على خدمات الطعام." },
  testimonial3Role: { en: "Campus Administrator", ar: "مديرة حرم جامعي" },
  testimonial3Content: { en: "CampusBites has streamlined our campus dining operations. The admin dashboard gives us complete oversight of food services.", ar: "قام كامبوس بايتس بتبسيط عمليات تناول الطعام في الحرم الجامعي. تمنحنا لوحة التحكم الإدارية إشرافاً كاملاً على خدمات الطعام." },
  
  // CTA Section
  readyToOrder: { en: "Ready to Order?", ar: "مستعد للطلب؟" },
  downloadNow: { en: "Download CampusBites Now", ar: "حمل كامبوس بايتس الآن" },
  ctaTitle: { en: "Ready to Transform Your Campus Dining?", ar: "مستعد لتحويل تجربة تناول الطعام في الحرم الجامعي؟" },
  ctaDescription: { en: "Join thousands of students enjoying convenient campus dining with CampusBites.", ar: "انضم إلى آلاف الطلاب الذين يستمتعون بتناول طعام مريح في الحرم الجامعي مع كامبوس بايتس." },
  ctaSubtitle: { en: "Join thousands of students enjoying convenient campus dining with CampusBites.", ar: "انضم إلى آلاف الطلاب الذين يستمتعون بتناول طعام مريح في الحرم الجامعي مع كامبوس بايتس." },
  downloadFreeApp: { en: "Download Free App", ar: "تحميل التطبيق مجاناً" },
  exploreVendors: { en: "Explore Vendors", ar: "استكشف الموردين" },
  orderNow: { en: "Order Now", ar: "اطلب الآن" },
  statsUsers: { en: "10K+", ar: "10K+" },
  statsRating: { en: "4.9", ar: "4.9" },
  statsDelivery: { en: "15min", ar: "15 دقيقة" },
  appRating: { en: "App Rating", ar: "تقييم التطبيق" },
  avgDelivery: { en: "Avg Delivery", ar: "متوسط التوصيل" },
  activeUsers: { en: "Active Users", ar: "مستخدم نشط" },
  appStoreRating: { en: "App Store Rating", ar: "تقييم متجر التطبيقات" },
  campusesServed: { en: "Campuses Served", ar: "حرم جامعي نخدمه" },
  
  // Footer
  brandDesc: { en: "Mobile food delivery application tailored for university campuses, connecting students with their favorite campus dining options.", ar: "تطبيق توصيل الطعام المحمول المصمم للحرم الجامعي، يربط الطلاب بخيارات تناول الطعام المفضلة لديهم في الحرم الجامعي." },
  forStudents: { en: "For Students", ar: "للطلاب" },
  forVendors: { en: "For Vendors", ar: "للموردين" },
  forAdmins: { en: "For Admins", ar: "للمديرين" },
  orderHistory: { en: "Order History", ar: "تاريخ الطلبات" },
  vendorDashboard: { en: "Vendor Dashboard", ar: "لوحة تحكم المورد" },
  menuManagement: { en: "Menu Management", ar: "إدارة القائمة" },
  orderManagement: { en: "Order Management", ar: "إدارة الطلبات" },
  platformOverview: { en: "Platform Overview", ar: "نظرة عامة على المنصة" },
  vendorApproval: { en: "Vendor Approval", ar: "موافقة المورد" },
  allRightsReserved: { en: "© 2025 CampusBites. All rights reserved.", ar: "© 2024 كامبوس بايتس. جميع الحقوق محفوظة." },
  privacyPolicy: { en: "Privacy Policy", ar: "سياسة الخصوصية" },
  termsOfService: { en: "Terms of Service", ar: "شروط الخدمة" },
  contact: { en: "Contact", ar: "اتصل بنا" },
  userGuide: { en: "User Guide", ar: "دليل المستخدم" },
  
  // IPhone Mockup additional content
  goodMorning: { en: "Good morning, Sarah!", ar: "صباح الخير، سارة!" },
  searchFood: { en: "Search for food...", ar: "البحث عن الطعام..." },
  orderUpdate: { en: "Your pizza order is ready!", ar: "طلب البيتزا جاهز!" },
  minutesAgo: { en: "5 minutes ago", ar: "منذ 5 دقائق" },

  // Authentication
  loginTitle: { en: "Welcome Back", ar: "مرحباً بعودتك" },
  loginSubtitle: { en: "Sign in to your CampusBites account", ar: "سجل دخولك إلى حساب كامبوس بايتس" },
  email: { en: "Email", ar: "البريد الإلكتروني" },
  emailPlaceholder: { en: "Enter your email", ar: "أدخل بريدك الإلكتروني" },
  password: { en: "Password", ar: "كلمة المرور" },
  passwordPlaceholder: { en: "Enter your password", ar: "أدخل كلمة المرور" },
  forgotPassword: { en: "Forgot Password?", ar: "نسيت كلمة المرور؟" },
  signInButton: { en: "Sign In", ar: "تسجيل الدخول" },
  dontHaveAccount: { en: "Don't have an account?", ar: "ليس لديك حساب؟" },
  signUp: { en: "Sign Up", ar: "إنشاء حساب" },
  
  // Role Selection
  selectRole: { en: "Select Your Role", ar: "اختر دورك" },
  roleDescription: { en: "Choose how you want to use CampusBites", ar: "اختر كيف تريد استخدام كامبوس بايتس" },
  studentRole: { en: "Student", ar: "طالب" },
  studentRoleDesc: { en: "Order food from campus vendors", ar: "اطلب الطعام من موردي الحرم الجامعي" },
  vendorRole: { en: "Food Vendor", ar: "مورد طعام" },
  vendorRoleDesc: { en: "Manage your restaurant or food business", ar: "أدر مطعمك أو عملك في الطعام" },
  adminRole: { en: "Administrator", ar: "مدير" },
  adminRoleDesc: { en: "Manage campus dining operations", ar: "أدر عمليات تناول الطعام في الحرم الجامعي" },
  continue: { en: "Continue", ar: "متابعة" },
  
  // Forgot Password
  forgotPasswordTitle: { en: "Reset Your Password", ar: "إعادة تعيين كلمة المرور" },
  forgotPasswordSubtitle: { en: "Enter your email to receive reset instructions", ar: "أدخل بريدك الإلكتروني لاستلام تعليمات إعادة التعيين" },
  sendResetEmail: { en: "Send Reset Email", ar: "إرسال رسالة إعادة التعيين" },
  backToLogin: { en: "Back to Login", ar: "العودة لتسجيل الدخول" },
  resetEmailSent: { en: "Reset email sent! Check your inbox.", ar: "تم إرسال رسالة إعادة التعيين! تحقق من صندوق الوارد." },
  
  // Form Validation
  emailRequired: { en: "Email is required", ar: "البريد الإلكتروني مطلوب" },
  emailInvalid: { en: "Please enter a valid email", ar: "يرجى إدخال بريد إلكتروني صحيح" },
  passwordRequired: { en: "Password is required", ar: "كلمة المرور مطلوبة" },
  passwordMinLength: { en: "Password must be at least 8 characters", ar: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" },
  nameRequired: { en: "Name is required", ar: "الاسم مطلوب" },
  roleRequired: { en: "Please select a role", ar: "يرجى اختيار دور" },
  
  // Error Messages
  loginError: { en: "Invalid email or password", ar: "بريد إلكتروني أو كلمة مرور غير صحيحة" },
  resetPasswordError: { en: "Failed to send reset email", ar: "فشل في إرسال رسالة إعادة التعيين" },
  networkError: { en: "Network error. Please try again.", ar: "خطأ في الشبكة. يرجى المحاولة مرة أخرى." },
  
  // Success Messages
  loginSuccess: { en: "Login successful!", ar: "تم تسجيل الدخول بنجاح!" },
  logoutSuccess: { en: "Logout successful!", ar: "تم تسجيل الخروج بنجاح!" },
  
  // Registration
  createAccount: { en: "Create Account", ar: "إنشاء حساب" },
  signUpSubtitle: { en: "Join CampusBites today", ar: "انضم إلى كامبوس بايتس اليوم" },
  fullName: { en: "Full Name", ar: "الاسم الكامل" },
  namePlaceholder: { en: "Enter your full name", ar: "أدخل اسمك الكامل" },
  confirmPassword: { en: "Confirm Password", ar: "تأكيد كلمة المرور" },
  confirmPasswordPlaceholder: { en: "Confirm your password", ar: "أكد كلمة المرور" },
  alreadyHaveAccount: { en: "Already have an account?", ar: "لديك حساب بالفعل؟" },
  passwordsDoNotMatch: { en: "Passwords do not match", ar: "كلمات المرور غير متطابقة" },
  registrationSuccess: { en: "Registration successful!", ar: "تم التسجيل بنجاح!" },
  welcomeMessage: { en: "Welcome to CampusBites!", ar: "مرحباً بك في كامبوس بايتس!" },
  emailAlreadyExists: { en: "Email already exists", ar: "البريد الإلكتروني موجود بالفعل" },
  registrationError: { en: "Registration failed. Please try again.", ar: "فشل التسجيل. يرجى المحاولة مرة أخرى." },
  loading: { en: "Loading...", ar: "جاري التحميل..." },
  
  // Role Selection Additional
  welcomeBack: { en: "Welcome back", ar: "مرحباً بعودتك" },
  roleUpdated: { en: "Role updated successfully!", ar: "تم تحديث الدور بنجاح!" },
  redirectingToDashboard: { en: "Redirecting to your dashboard...", ar: "جاري التوجه إلى لوحة التحكم..." }
};

interface LanguageContextType {
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  t: (key: string) => string;
  isRTL: boolean;
  navigateToLanguage: (lang: 'en' | 'ar') => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  
  // Detect language from URL
  const getLanguageFromPath = (path: string): 'en' | 'ar' => {
    if (path.startsWith('/ar')) return 'ar';
    if (path.startsWith('/en')) return 'en';
    
    // Default fallback - check saved preference or default to 'en'
    if (typeof window !== 'undefined') {
      // Check localStorage first
      const savedLanguage = localStorage.getItem('campusbites-language') as 'en' | 'ar';
      if (savedLanguage) return savedLanguage;
      
      // Check cookies as fallback
      const cookieLanguage = document.cookie
        .split('; ')
        .find(row => row.startsWith('campusbites-language='))
        ?.split('=')[1] as 'en' | 'ar';
      if (cookieLanguage) return cookieLanguage;
    }
    
    return 'en';
  };

  // Initialize language from URL immediately
  const initialLanguage = getLanguageFromPath(pathname);
  const [language, setLanguage] = useState<'en' | 'ar'>(initialLanguage);
  const [mounted, setMounted] = useState(false);

  // Update language when URL changes
  useEffect(() => {
    const newLanguage = getLanguageFromPath(pathname);
    if (newLanguage !== language) {
      setLanguage(newLanguage);
    }
    setMounted(true);
  }, [pathname, language]);

  // Save language preference to localStorage and cookies
  useEffect(() => {
    if (mounted) {
      // Save to localStorage for client-side persistence
      localStorage.setItem('campusbites-language', language);
      
      // Save to cookies for server-side access (middleware)
      document.cookie = `campusbites-language=${language}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    }
  }, [language, mounted]);

  const navigateToLanguage = (lang: 'en' | 'ar') => {
    // Navigate to the appropriate language route
    if (lang === 'en') {
      router.push('/en');
    } else if (lang === 'ar') {
      router.push('/ar');
    }
  };

  const handleSetLanguage = (lang: 'en' | 'ar') => {
    navigateToLanguage(lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const isRTL = language === 'ar';

  // Prevent hydration mismatch by always using the correct language from URL
  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: handleSetLanguage, 
      t, 
      isRTL,
      navigateToLanguage 
    }}>
      {children}
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
