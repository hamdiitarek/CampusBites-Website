
"use client";

import { Download, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { RTLFlex } from './RTLContainer';

const CTA = () => {
  const { t, isRTL } = useLanguage();
  
  return (
    <section className="py-20 bg-gradient-to-br from-orange-600 via-red-600 to-pink-700 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className={`text-4xl md:text-6xl font-bold text-white mb-6 animate-fadeInUp ${isRTL ? 'font-arabic cta-extra-spacing' : ''}`}>
          {t('ctaTitle')}
        </h2>
        <p className={`text-xl md:text-2xl text-orange-100 mb-12 max-w-3xl mx-auto animate-fadeInUp ${isRTL ? 'font-arabic' : ''}`} style={{ animationDelay: '0.2s' }}>
          {t('ctaDescription')}
        </p>

        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12 animate-fadeInUp`} style={{ animationDelay: '0.4s' }}>
          <button className="group bg-white text-orange-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-xl flex items-center">
            <Download className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('downloadApp')}
          </button>
          <button className="group text-white border-2 border-white/30 px-8 py-4 rounded-full text-lg font-bold hover:bg-white/10 transition-all duration-200 transform hover:scale-105 flex items-center">
            {t('orderNow')}
            <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'mr-2 group-hover:-translate-x-1 rotate-180' : 'ml-2'}`} />
          </button>
        </div>

        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-12 text-orange-100 animate-fadeInUp ${isRTL ? 'sm:flex-row-reverse' : ''}`} style={{ animationDelay: '0.6s' }}>
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className={`text-2xl font-bold text-white ${isRTL ? 'ml-2' : 'mr-2'}`}>{t('statsUsers')}</span>
            <span>{t('activeUsers')}</span>
          </div>
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className={`text-2xl font-bold text-white ${isRTL ? 'ml-2' : 'mr-2'}`}>{t('statsRating')}</span>
            <span>{t('appRating')}</span>
          </div>
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className={`text-2xl font-bold text-white ${isRTL ? 'ml-2' : 'mr-2'}`}>{t('statsDelivery')}</span>
            <span>{t('avgDelivery')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
