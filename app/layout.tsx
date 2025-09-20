import Providers from "./providers";
import "./globals.css";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: "CampusBites - طعام الحرم الجامعي | Campus Food Delivery App Egypt",
    template: "%s | CampusBites - طعام الحرم الجامعي"
  },
  description: "طلب طعام الجامعة في مصر 🍕 | Egypt's #1 campus food delivery app. Order from university restaurants, cafeterias & food trucks. Fast delivery to dorms & study areas across Egyptian universities. توصيل طعام سريع للحرم الجامعي",
  keywords: [
    // Arabic Keywords (Egyptian dialect + MSA)
    "توصيل طعام جامعي", "أكل الجامعة", "طلب طعام مصر", "توصيل أكل للجامعة", 
    "كافيتيريا الجامعة", "مطاعم الحرم الجامعي", "أكل الطلبة", "كانتين الجامعة",
    "فود ديليفري جامعة", "اكل دليفري كلية", "طعام طلاب", "وجبات جامعية",
    
    // English Keywords
    "campus food delivery Egypt", "university food delivery", "student food app",
    "campus dining Egypt", "college food delivery", "university restaurant delivery",
    "student meal delivery", "campus cafeteria delivery", "Egyptian university food",
    "Cairo university food", "Alexandria university dining", "student discount food"
  ],
  authors: [{ name: "CampusBites Team" }],
  creator: "CampusBites",
  publisher: "CampusBites",
  metadataBase: new URL('https://campusbites.com'),
  alternates: {
    canonical: 'https://campusbites.com',
    languages: {
      'en-US': 'https://campusbites.com/en',
      'ar-EG': 'https://campusbites.com/ar',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ar_EG'],
    url: 'https://campusbites.com',
    title: 'CampusBites - طعام الحرم الجامعي | Egypt Campus Food Delivery',
    description: 'اطلب أكلك المفضل من الجامعة 🚀 Order your favorite campus food with lightning-fast delivery to Egyptian universities. منصة توصيل الطعام الأولى في الجامعات المصرية',
    siteName: 'CampusBites',
    images: [
      {
        url: '/icon.png',
        width: 586,
        height: 586,
        alt: 'CampusBites - Campus Food Delivery Egypt',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CampusBites - طعام الحرم الجامعي | Egypt Campus Food Delivery',
    description: 'اطلب أكلك المفضل من الجامعة 🚀 Egypt\'s fastest campus food delivery app',
    images: ['/icon.png'],
    creator: '@CampusBitesEG',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  category: 'Food Delivery',
  classification: 'Business',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'format-detection': 'telephone=no',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#ea580c" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        
        {/* Arabic fonts for better rendering */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&family=Inter:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        
        {/* Initial script to prevent layout shift */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function setInitialDirection() {
                  try {
                    var path = window.location.pathname;
                    var isArabic = path.startsWith('/ar');
                    var html = document.documentElement;
                    var body = document.body;
                    
                    // Ensure elements exist before modifying them
                    if (html) {
                      html.dir = isArabic ? 'rtl' : 'ltr';
                      html.lang = isArabic ? 'ar' : 'en';
                      
                      // Remove existing direction classes
                      html.className = html.className.replace(/\\b(dir-ltr|dir-rtl)\\b/g, '');
                      html.classList.add(isArabic ? 'dir-rtl' : 'dir-ltr');
                    }
                    
                    if (body) {
                      if (isArabic) {
                        body.className = body.className.replace(/\\bfont-inter\\b/g, '') + ' font-arabic';
                        body.style.direction = 'rtl';
                      } else {
                        body.className = body.className.replace(/\\bfont-arabic\\b/g, '') + ' font-inter';
                        body.style.direction = 'ltr';
                      }
                    }
                  } catch (error) {
                    console.warn('Error setting initial direction:', error);
                  }
                }
                
                // Run immediately if DOM is ready, otherwise wait
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', setInitialDirection);
                } else {
                  setInitialDirection();
                }
                
                // Also run before React hydrates
                setInitialDirection();
              })();
            `
          }}
        />
        
        {/* Arabic fonts for better rendering */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&family=Inter:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "CampusBites",
              "alternateName": "كامبوس بايتس",
              "url": "https://campusbites.com",
              "logo": "https://campusbites.com/logo.png",
              "description": "Egypt's leading campus food delivery platform connecting students with university restaurants and cafeterias",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "EG",
                "addressRegion": "Cairo"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+20-xxx-xxx-xxxx",
                "contactType": "customer service",
                "availableLanguage": ["Arabic", "English"]
              },
              "sameAs": [
                "https://facebook.com/campusbitesg",
                "https://instagram.com/campusbites.eg",
                "https://twitter.com/campusbitesg"
              ]
            })
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
