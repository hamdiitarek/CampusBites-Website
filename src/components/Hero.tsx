
import { Play, Download, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import IPhoneMockup from './IPhoneMockup';

const Hero = () => {
  const { t, isRTL } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isRTL ? 'text-right' : 'text-left'}`}>
          <div>
            {/* Badge */}
            <div className={`inline-flex items-center px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-purple-200 mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Star className="w-4 h-4 text-yellow-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">{t('trustedBy')}</span>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-800 via-gray-900 to-black bg-clip-text text-transparent">
                {t('connectLearnSucceed')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl leading-relaxed">
              {t('heroSubtitle')}
            </p>

            {/* CTA buttons */}
            <div className={`flex flex-col sm:flex-row items-center justify-start space-y-4 sm:space-y-0 sm:space-x-6 mb-16 ${isRTL ? 'sm:space-x-reverse sm:flex-row-reverse sm:justify-end' : ''}`}>
              <button className="group bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-xl hover:shadow-2xl">
                <Download className={`w-5 h-5 inline-block ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('downloadApp')}
              </button>
              <button className="group flex items-center px-8 py-4 rounded-full text-lg font-semibold text-gray-700 bg-white/60 backdrop-blur-sm border border-gray-200 hover:bg-white/80 transition-all duration-200 transform hover:scale-105">
                <Play className={`w-5 h-5 group-hover:text-purple-600 transition-colors ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('watchDemo')}
              </button>
            </div>
          </div>

          {/* iPhone Mockup */}
          <div className="flex justify-center lg:justify-end">
            <IPhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
