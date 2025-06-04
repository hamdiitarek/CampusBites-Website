"use client";

import { Users, Store, Shield, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t, isRTL } = useLanguage();
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-8 ${isRTL ? 'text-right' : 'text-left'}`}>
          {/* Brand */}
          <div className="space-y-4">
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className={`text-xl font-bold text-white ${isRTL ? 'mr-3' : 'ml-3'}`}>CampusBites</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              {t('brandDesc')}
            </p>
            <div className={`flex gap-4 ${isRTL ? 'justify-end' : 'justify-start'}`}>
              <Facebook className="w-5 h-5 hover:text-blue-400 cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 hover:text-blue-400 cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 hover:text-pink-400 cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 hover:text-blue-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* For Students */}
          <div>
            <h3 className={`text-white font-semibold mb-4 flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Users className={`w-5 h-5 text-orange-400 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('forStudents')}
            </h3>
            <ul className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              <li><a href="#" className="hover:text-white transition-colors">{t('browseMenus')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('orderHistory')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('trackDelivery')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('multiplePayments')}</a></li>
            </ul>
          </div>

          {/* For Vendors */}
          <div>
            <h3 className={`text-white font-semibold mb-4 flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Store className={`w-5 h-5 text-green-400 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('forVendors')}
            </h3>
            <ul className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              <li><a href="#" className="hover:text-white transition-colors">{t('vendorDashboard')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('menuManagement')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('trackSales')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('orderManagement')}</a></li>
            </ul>
          </div>

          {/* For Admins */}
          <div>
            <h3 className={`text-white font-semibold mb-4 flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Shield className={`w-5 h-5 text-purple-400 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('forAdmins')}
            </h3>
            <ul className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              <li><a href="#" className="hover:text-white transition-colors">{t('manageVendors')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('platformOverview')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('vendorApproval')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('qualityControl')}</a></li>
            </ul>
          </div>
        </div>

        <div className={`border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center ${isRTL ? 'md:flex-row-reverse' : ''}`}>
          <p className={`text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('allRightsReserved')}
          </p>
          <div className={`flex gap-6 mt-4 md:mt-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">{t('privacyPolicy')}</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">{t('termsOfService')}</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">{t('contact')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
