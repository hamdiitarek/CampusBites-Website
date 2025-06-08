"use client";

import { MapPin, Zap, Shield, Smartphone, Bell, CreditCard } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { RTLGrid } from './RTLContainer';

const Features = () => {
  const { t, isRTL } = useLanguage();

  const features = [
    {
      icon: MapPin,
      title: t('realTimeTracking'),
      description: t('realTimeTrackingDesc')
    },
    {
      icon: Shield,
      title: t('campusOptimized'),
      description: t('campusOptimizedDesc')
    },
    {
      icon: Zap,
      title: t('quickDelivery'),
      description: t('quickDeliveryDesc')
    },
    {
      icon: Smartphone,
      title: t('studentDeals'),
      description: t('studentDealsDesc')
    },
    {
      icon: CreditCard,
      title: t('multiplePayments'),
      description: t('multiplePaymentsDesc')
    },
    {
      icon: Bell,
      title: t('pushNotifications'),
      description: t('pushNotificationsDesc')
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fadeInUp">
            <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {t('whyChoose')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            {t('featuresSubtitle')}
          </p>
        </div>

        <RTLGrid 
          cols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
          className="gap-8"
        >
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:border-orange-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 animate-fadeInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-gradient-to-r from-orange-600 to-red-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </RTLGrid>
      </div>
    </section>
  );
};

export default Features;
