import Header from '../(landing)/components/Header';
import Hero from '../(landing)/components/Hero';
import Features from '../(landing)/components/Features';
import RoleSection from '../(landing)/components/RoleSection';
import Testimonials from '../(landing)/components/Testimonials';
import CTA from '../(landing)/components/CTA';
import Footer from '../(landing)/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "كامبوس بايتس - تطبيق توصيل الطعام الجامعي | اطلب من مطاعم الجامعة",
  description: "اطلب أكلك المفضل من الجامعة في دقايق! 🍕 توصيل سريع لكل الجامعات المصرية - القاهرة، الاسكندرية، عين شمس، حلوان. كانتين، كافيتيريا، مطاعم الحرم الجامعي. تطبيق طلاب مصر الأول!",
  keywords: [
    // Arabic keywords with Egyptian dialect
    "توصيل أكل جامعة القاهرة", "كانتين جامعة عين شمس", "طعام جامعة الاسكندرية",
    "أكل جامعة حلوان", "كافيتيريا جامعة الزقازيق", "مطاعم حرم جامعي مصر",
    "تطبيق طعام طلاب", "دليفري أكل كلية", "وجبات طلبة الجامعة",
    "أكل رخيص للطلاب", "عروض طعام جامعي", "فود ديليفري جامعات مصر",
    "طلب طعام اونلاين", "توصيل كانتين", "خدمة طعام طلابية"
  ],
  openGraph: {
    title: "اطلب أكلك من الجامعة في دقايق! 🚀 كامبوس بايتس",
    description: "التطبيق الأول لتوصيل الطعام في الجامعات المصرية. عروض حصرية للطلاب، توصيل سريع، أكل طازج",
    url: "https://campusbites.com/ar",
    locale: "ar_EG",
  },
  alternates: {
    canonical: "https://campusbites.com/ar",
    languages: {
      'en': 'https://campusbites.com/en',
      'x-default': 'https://campusbites.com',
    },
  }
};

export default function ArabicHome() {
  return (
    <>
      {/* Main content */}
      <div className="min-h-screen" dir="rtl">
        <Header />
        <main>
          <Hero />
          <Features />
          <RoleSection />
         {/* <Testimonials /> */}
          <CTA />
        </main>
        <Footer />
      </div>

      {/* Schema for Arabic page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["WebPage", "Service"],
            "name": "كامبوس بايتس - توصيل الطعام الجامعي",
            "description": "منصة توصيل الطعام الجامعي الأولى في مصر للطلاب",
            "url": "https://campusbites.com/ar",
            "inLanguage": "ar",
            "provider": {
              "@type": "Organization",
              "name": "CampusBites",
              "alternateName": "كامبوس بايتس",
              "url": "https://campusbites.com"
            },
            "serviceType": "خدمة توصيل الطعام",
            "areaServed": {
              "@type": "Country",
              "name": "Egypt",
              "alternateName": "مصر"
            }
          })
        }}
      />
    </>
  );
}
