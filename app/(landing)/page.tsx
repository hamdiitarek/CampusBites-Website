import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import RoleSection from './components/RoleSection';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "CampusBites Egypt | أفضل تطبيق توصيل طعام جامعي في مصر 🚀",
  description: "اطلب أكلك المفضل من الجامعة في دقايق! 🍕 توصيل سريع لكل الجامعات المصرية - القاهرة، الاسكندرية، عين شمس، حلوان. كانتين، كافيتيريا، مطاعم الحرم الجامعي. تطبيق طلاب مصر الأول للطعام!",
  keywords: [
    // High-intent Egyptian Arabic keywords
    "توصيل أكل جامعة القاهرة", "كانتين جامعة عين شمس", "طعام جامعة الاسكندرية",
    "أكل جامعة حلوان", "كافيتيريا جامعة الزقازيق", "مطاعم حرم جامعي مصر",
    "تطبيق طعام طلاب", "دليفري أكل كلية", "وجبات طلبة الجامعة",
    "أكل رخيص للطلاب", "عروض طعام جامعي", "فود ديليفري جامعات مصر",
    
    // English long-tail keywords
    "campus food delivery cairo university", "alexandria university food app",
    "ain shams university cafeteria delivery", "helwan university food ordering",
    "egyptian university dining app", "student meal delivery egypt",
    "campus restaurant delivery cairo", "university food truck ordering"
  ],
  openGraph: {
    title: "اطلب أكلك من الجامعة في دقايق! 🚀 CampusBites Egypt",
    description: "التطبيق الأول لتوصيل الطعام في الجامعات المصرية. عروض حصرية للطلاب، توصيل سريع، أكل طازج من الكانتين والمطاعم",
    url: "https://campusbites.com",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "CampusBites - تطبيق توصيل الطعام الجامعي في مصر"
      }
    ]
  },
  alternates: {
    canonical: "https://campusbites.com",
  }
};

export default function Home() {
  return (
    <>
      {/* Main content */}
      <div className="min-h-screen">
        <Header />
        <main>
          <Hero />
          <Features />
          <RoleSection />
          <Testimonials />
          <CTA />
          <Footer />
        </main>
      </div>

      {/* Enhanced Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["WebPage", "Service"],
            "name": "CampusBites - Campus Food Delivery Egypt",
            "description": "Egypt's premier campus food delivery service connecting students with university restaurants, cafeterias, and food vendors across Egyptian universities.",
            "url": "https://campusbites.com",
            "provider": {
              "@type": "Organization",
              "name": "CampusBites",
              "url": "https://campusbites.com"
            },
            "serviceType": "Food Delivery Service",
            "areaServed": {
              "@type": "Country",
              "name": "Egypt"
            },
            "availableChannel": {
              "@type": "ServiceChannel",
              "serviceUrl": "https://campusbites.com",
              "serviceName": "Campus Food Delivery"
            },
            "offers": {
              "@type": "Offer",
              "description": "Student discounts and fast campus delivery",
              "availabilityStarts": "2024-01-01",
              "availabilityEnds": "2025-12-31"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "15000",
              "bestRating": "5",
              "worstRating": "1"
            }
          })
        }}
      />

      {/* FAQ Schema for common questions */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "ازاي أطلب أكل من الجامعة؟",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "حمل تطبيق CampusBites، اختار جامعتك، تصفح المطاعم والكانتين المتاحة، اطلب أكلك المفضل، وهيوصلك في أقل من 20 دقيقة!"
                }
              },
              {
                "@type": "Question", 
                "name": "هل فيه رسوم توصيل؟",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "رسوم التوصيل تبدأ من 5 جنيه بس! ولو طلبك أكتر من 50 جنيه، التوصيل مجاني تماماً."
                }
              },
              {
                "@type": "Question",
                "name": "What universities does CampusBites serve in Egypt?",
                "acceptedAnswer": {
                  "@type": "Answer", 
                  "text": "CampusBites serves major Egyptian universities including Cairo University, Alexandria University, Ain Shams University, Helwan University, Zagazig University, and many more across Egypt."
                }
              }
            ]
          })
        }}
      />
    </>
  );
}
