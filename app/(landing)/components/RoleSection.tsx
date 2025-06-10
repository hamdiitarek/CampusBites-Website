"use client";

import { Users, Store, Shield, MenuSquare, ShoppingCart, MapPin, BarChart3, CreditCard, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import IPhone16ProMockup from './IPhoneMockup';

const RoleSection = () => {
  const { t, isRTL } = useLanguage();

  const roles = [
    {
      title: t('students'),
      subtitle: t('studentsSubtitle'),
      description: t('studentsDesc'),
      icon: Users,
      gradient: "from-orange-500 to-red-600",
      screenshots: ["/image/screen1.png"], // Student app interface
      features: [
        { icon: MenuSquare, title: t('browseMenus2'), description: t('browseMenusDesc') },
        { icon: ShoppingCart, title: t('placeOrders'), description: t('placeOrdersDesc') },
        { icon: MapPin, title: t('trackDelivery'), description: t('trackDeliveryDesc') }
      ]
    },
    {
      title: t('vendors'),
      subtitle: t('vendorsSubtitle'),
      description: t('vendorsDesc'),
      icon: Store,
      gradient: "from-green-500 to-emerald-600",
      screenshots: ["/image/screen1.png"], // Vendor dashboard interface - replace with vendor-specific screenshot
      features: [
        { icon: MenuSquare, title: t('manageMenu'), description: t('manageMenuDesc') },
        { icon: Clock, title: t('receiveOrders'), description: t('receiveOrdersDesc') },
        { icon: BarChart3, title: t('trackSales'), description: t('trackSalesDesc') }
      ]
    },
    {
      title: t('administrators'),
      subtitle: t('administratorsSubtitle'),
      description: t('administratorsDesc'),
      icon: Shield,
      gradient: "from-purple-500 to-pink-600",
      screenshots: ["/image/screen1.png"], // Admin control interface - replace with admin-specific screenshot
      features: [
        { icon: BarChart3, title: t('overseeOperations'), description: t('overseeOperationsDesc') },
        { icon: Store, title: t('manageVendors'), description: t('manageVendorsDesc') },
        { icon: Shield, title: t('qualityControl'), description: t('qualityControlDesc') }
      ]
    }
  ];

  return (
    <section id="roles" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isRTL ? 'font-arabic rtl-text-spacing' : ''}`}>
            <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {t('builtForEveryone')}
            </span>
          </h2>
          <p className={`text-xl text-gray-600 max-w-3xl mx-auto paragraph-rtl ${isRTL ? 'rtl-text-spacing' : ''}`}>
            {t('builtForEveryoneDesc')}
          </p>
        </div>

        <div className="space-y-20">
          {roles.map((role, index) => {
            const isEvenIndex = index % 2 === 0;
            const contentOrder = isRTL ? (isEvenIndex ? 'lg:order-2' : 'lg:order-1') : (isEvenIndex ? 'lg:order-1' : 'lg:order-2');
            const imageOrder = isRTL ? (isEvenIndex ? 'lg:order-1' : 'lg:order-2') : (isEvenIndex ? 'lg:order-2' : 'lg:order-1');
            
            return (
              <div key={role.title} className={`flex flex-col lg:flex-row items-center gap-12`}>
                {/* Content */}
                <div className={`flex-1 space-y-8 ${contentOrder} card-rtl`}>
                  <div>
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${role.gradient} mb-6`}>
                      <role.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-3 ${isRTL ? 'font-arabic rtl-text-spacing' : ''}`}>{role.title}</h3>
                    <p className={`text-lg font-semibold bg-gradient-to-r ${role.gradient} bg-clip-text text-transparent mb-4 ${isRTL ? 'rtl-text-spacing' : ''}`}>
                      {role.subtitle}
                    </p>
                    <p className={`text-gray-600 text-lg leading-relaxed paragraph-rtl ${isRTL ? 'rtl-text-spacing' : ''}`}>
                      {role.description}
                    </p>
                  </div>

                  <div className="grid gap-6">
                    {role.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r ${role.gradient} flex items-center justify-center`}>
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="card-rtl">
                          <h4 className={`font-semibold text-gray-900 mb-1 ${isRTL ? 'font-arabic' : ''}`}>{feature.title}</h4>
                          <p className={`text-gray-600 paragraph-rtl ${isRTL ? 'rtl-text-spacing' : ''}`}>{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className={`bg-gradient-to-r ${role.gradient} text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-all duration-200 transform hover:scale-105`}>
                    {t('learnMore')}
                  </button>
                </div>

                {/* Visual */}
                <div className={`flex-1 flex justify-center ${imageOrder}`}>
                  <div className="relative w-full max-w-sm">
                    <IPhone16ProMockup 
                      screenshots={role.screenshots}
                      autoRotate={false}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RoleSection;
