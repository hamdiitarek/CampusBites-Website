"use client";

import { Users, Store, Shield, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t, isRTL } = useLanguage();
  
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-red-500/10 rounded-full blur-xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 ${isRTL ? 'text-right' : 'text-left'}`}>
            
            {/* Brand Section - Enhanced */}
            <div className="lg:col-span-1 space-y-6">
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                <span className={`text-2xl font-bold text-white icon-before ${isRTL ? 'font-arabic' : ''}`}>
                  CampusBites
                </span>
              </div>
              
              <p className={`text-gray-400 leading-relaxed text-sm max-w-xs paragraph-rtl ${isRTL ? 'rtl-text-spacing' : ''}`}>
                {t('brandDesc')}
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className={`flex items-center text-sm text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Mail className="w-4 h-4 icon-before" />
                  <span>hello@campusbites.com</span>
                </div>
                <div className={`flex items-center text-sm text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Phone className="w-4 h-4 icon-before" />
                  <span>+20 xxx-xxx-xxxx</span>
                </div>
                <div className={`flex items-center text-sm text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <MapPin className="w-4 h-4 icon-before" />
                  <span>{isRTL ? 'القاهرة، مصر' : 'Cairo, Egypt'}</span>
                </div>
              </div>

              {/* Social Media - Enhanced */}
              <div className={`flex gap-3 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                <a href="#" className="group w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600 transition-all duration-300">
                  <Facebook className="w-4 h-4 group-hover:text-white transition-colors" />
                </a>
                <a href="#" className="group w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600 transition-all duration-300">
                  <Twitter className="w-4 h-4 group-hover:text-white transition-colors" />
                </a>
                <a href="#" className="group w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600 transition-all duration-300">
                  <Instagram className="w-4 h-4 group-hover:text-white transition-colors" />
                </a>
                <a href="#" className="group w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600 transition-all duration-300">
                  <Linkedin className="w-4 h-4 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>

            {/* For Students */}
            <div className="space-y-4">
              <h3 className={`text-white font-bold text-lg mb-6 flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
                  <Users className="w-4 h-4 text-white" />
                </div>
                {t('forStudents')}
              </h3>
              <ul className={`space-y-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                <li>
                  <a href="#" className={`group flex items-center text-gray-400 hover:text-white transition-all duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <ArrowRight className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
                    {t('browseMenus')}
                  </a>
                </li>
                <li>
                  <a href="#" className={`group flex items-center text-gray-400 hover:text-white transition-all duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <ArrowRight className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
                    {t('orderHistory')}
                  </a>
                </li>
                <li>
                  <a href="#" className={`group flex items-center text-gray-400 hover:text-white transition-all duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <ArrowRight className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
                    {t('trackDelivery')}
                  </a>
                </li>
                <li>
                  <a href="#" className={`group flex items-center text-gray-400 hover:text-white transition-all duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <ArrowRight className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
                    {t('multiplePayments')}
                  </a>
                </li>
              </ul>
            </div>

            {/* For Vendors */}
            <div className="space-y-4">
              <h3 className={`text-white font-bold text-lg mb-6 flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                  <Store className="w-4 h-4 text-white" />
                </div>
                {t('forVendors')}
              </h3>
              <ul className={`space-y-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                <li>
                  <a href="#" className={`group flex items-center text-gray-400 hover:text-white transition-all duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <ArrowRight className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
                    {t('vendorDashboard')}
                  </a>
                </li>
                <li>
                  <a href="#" className={`group flex items-center text-gray-400 hover:text-white transition-all duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <ArrowRight className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
                    {t('menuManagement')}
                  </a>
                </li>
                <li>
                  <a href="#" className={`group flex items-center text-gray-400 hover:text-white transition-all duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <ArrowRight className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
                    {t('trackSales')}
                  </a>
                </li>
                <li>
                  <a href="#" className={`group flex items-center text-gray-400 hover:text-white transition-all duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <ArrowRight className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
                    {t('orderManagement')}
                  </a>
                </li>
              </ul>
            </div>

            {/* For Admins */}
            <div className="space-y-4">
              <h3 className={`text-white font-bold text-lg mb-6 flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                {t('forAdmins')}
              </h3>
              <ul className={`space-y-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                <li>
                  <a href="#" className={`group flex items-center text-gray-400 hover:text-white transition-all duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <ArrowRight className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
                    {t('manageVendors')}
                  </a>
                </li>
                <li>
                  <a href="#" className={`group flex items-center text-gray-400 hover:text-white transition-all duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <ArrowRight className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
                    {t('platformOverview')}
                  </a>
                </li>
                <li>
                  <a href="#" className={`group flex items-center text-gray-400 hover:text-white transition-all duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <ArrowRight className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
                    {t('vendorApproval')}
                  </a>
                </li>
                <li>
                  <a href="#" className={`group flex items-center text-gray-400 hover:text-white transition-all duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <ArrowRight className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
                    {t('qualityControl')}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section - Enhanced */}
        <div className="border-t border-gray-700/50 py-8">
          <div className={`flex flex-col lg:flex-row justify-between items-center gap-6 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
            
            {/* Copyright */}
            <div className={`flex flex-col sm:flex-row items-center gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
              <p className="text-gray-400 text-sm">
                {t('allRightsReserved')}
              </p>
              <div className="hidden sm:block w-1 h-1 bg-gray-600 rounded-full"></div>
              <p className="text-gray-500 text-xs">
                {isRTL ? 'صُنع بـ ❤️ في مصر' : 'Made with ❤️ in Egypt'}
              </p>
            </div>

            {/* Legal Links */}
            <div className={`flex flex-wrap gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors hover:underline">
                {t('privacyPolicy')}
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors hover:underline">
                {t('termsOfService')}
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors hover:underline">
                {t('contact')}
              </a>
              <a href="/campus-food-guide-egypt" className="text-orange-400 hover:text-orange-300 text-sm transition-colors hover:underline font-medium">
                {isRTL ? 'دليل الطعام الجامعي' : 'Campus Food Guide'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
