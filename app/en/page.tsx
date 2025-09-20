import Header from '../(landing)/components/Header';
import Hero from '../(landing)/components/Hero';
import Features from '../(landing)/components/Features';
import RoleSection from '../(landing)/components/RoleSection';
import Testimonials from '../(landing)/components/Testimonials';
import CTA from '../(landing)/components/CTA';
import Footer from '../(landing)/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "CampusBites - Campus Food Delivery App | Order Food from University Restaurants",
  description: "Order your favorite campus food in minutes! 🍕 Fast delivery to all Egyptian universities - Cairo, Alexandria, Ain Shams, Helwan. Canteen, cafeteria, campus restaurants. Egypt's #1 student food app!",
  keywords: [
    // English keywords for international students
    "campus food delivery egypt", "university food delivery", "student food app",
    "campus dining egypt", "college food delivery", "university restaurant delivery",
    "student meal delivery", "campus cafeteria delivery", "egyptian university food",
    "cairo university food", "alexandria university dining", "student discount food",
    "campus food ordering", "university canteen delivery", "student food service"
  ],
  openGraph: {
    title: "Order Campus Food in Minutes! 🚀 CampusBites Egypt",
    description: "Egypt's premier campus food delivery app. Exclusive student discounts, fast delivery, fresh food from canteens and restaurants",
    url: "https://campusbites.com/en",
    locale: "en_US",
  },
  alternates: {
    canonical: "https://campusbites.com/en",
    languages: {
      'ar': 'https://campusbites.com/ar',
      'x-default': 'https://campusbites.com',
    },
  }
};

export default function EnglishHome() {
  return (
    <>
      {/* Main content */}
      <div className="min-h-screen">
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

      {/* Schema for English page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["WebPage", "Service"],
            "name": "CampusBites - Campus Food Delivery Egypt",
            "description": "Egypt's premier campus food delivery service for university students",
            "url": "https://campusbites.com/en",
            "inLanguage": "en",
            "provider": {
              "@type": "Organization",
              "name": "CampusBites",
              "url": "https://campusbites.com"
            },
            "serviceType": "Food Delivery Service",
            "areaServed": {
              "@type": "Country",
              "name": "Egypt"
            }
          })
        }}
      />

      {/* Chatwoot Live Chat Widget */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.chatwootSettings = {"position":"right","type":"expanded_bubble","launcherTitle":"Chat with us"};
            (function(d,t) {
              var BASE_URL="https://support.campusbites.app";
              var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
              g.src=BASE_URL+"/packs/js/sdk.js";
              g.async = true;
              s.parentNode.insertBefore(g,s);
              g.onload=function(){
                window.chatwootSDK && window.chatwootSDK.run({
                  websiteToken: 'iPue6ET7A6AZxn7KJh9q1ejA',
                  baseUrl: BASE_URL
                });
              }
            })(document,"script");
          `
        }}
      />
    </>
  );
}
