"use client";

import { ShoppingBag, Download, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import IPhone16ProMockup from './IPhoneMockup';

const Hero = () => {
  const { t, isRTL } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isRTL ? 'lg:grid-flow-col-dense' : ''}`}>
          {/* Text Content */}
          <div className={`${isRTL ? 'lg:col-start-2 text-right' : 'lg:col-start-1 text-left'}`}>
            {/* Badge */}
            <div className={`inline-flex items-center px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-orange-200 mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Star className={`w-4 h-4 text-yellow-500 icon-before`} />
              <span className="text-sm font-medium text-gray-700">{t('trustedBy')}</span>
            </div>

            {/* Main headline with SEO-optimized structure */}
            <h1 className={`text-5xl md:text-7xl font-bold mb-4 ${isRTL ? 'font-arabic rtl-text-spacing' : ''}`}>
              <span className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-800 bg-clip-text text-transparent">
                {t('heroTitle')}
              </span>
            </h1>
            
            {/* Subtitle with location-based keywords */}
            <h2 className={`text-2xl md:text-3xl font-semibold text-gray-700 mb-6 ${isRTL ? 'rtl-text-spacing' : ''}`}>
              {t('heroSubtitle')}
            </h2>

            {/* Rich description with embedded keywords */}
            <p className={`text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl leading-relaxed paragraph-rtl ${isRTL ? 'rtl-text-spacing' : ''}`}>
              {t('heroDescription')}
            </p>

            {/* Local SEO keywords for Egyptian universities */}
            <div className={`hidden md:flex flex-wrap gap-2 mb-8 ${isRTL ? 'justify-end flex-row-reverse' : 'justify-start'}`}>
              {[
                isRTL ? "جامعة القاهرة" : "Cairo University",
                isRTL ? "جامعة الإسكندرية" : "Alexandria University", 
                isRTL ? "جامعة عين شمس" : "Ain Shams University",
                isRTL ? "جامعة حلوان" : "Helwan University"
              ].map((university, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                >
                  {university}
                </span>
              ))}
            </div>

            {/* CTA buttons */}
            <div className={`btn-group-rtl flex-col sm:flex-row sm:gap-6 mb-16 ${isRTL ? 'items-end sm:items-center' : 'items-start sm:items-center'}`}>
              <button className="group bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-xl hover:shadow-2xl">
                <Download className={`w-5 h-5 inline-block icon-before`} />
                {t('downloadApp')}
              </button>
              <button className="group flex items-center px-8 py-4 rounded-full text-lg font-semibold text-gray-700 bg-white/60 backdrop-blur-sm border border-gray-200 hover:bg-white/80 transition-all duration-200 transform hover:scale-105">
                <ShoppingBag className={`w-5 h-5 group-hover:text-orange-600 transition-colors icon-before`} />
                {t('browseMenus')}
              </button>
            </div>
          </div>

          {/* iPhone 16 Pro Mockup */}
          <div className={`flex justify-center ${isRTL ? 'lg:col-start-1 lg:justify-end' : 'lg:col-start-2 lg:justify-start'}`}>
            <IPhone16ProMockup 
              screenshots={[
                "/image/screen1.png"
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
