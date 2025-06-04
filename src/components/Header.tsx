
"use client";

import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, isRTL } = useLanguage();

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200/20 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo Section */}
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className={`text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent ${isRTL ? 'mr-3' : 'ml-3'}`}>
              CampusBites
            </span>
          </div>

          {/* Navigation */}
          <nav className={`hidden md:flex items-center ${isRTL ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
            <a 
              href="#features" 
              className="text-gray-600 hover:text-orange-600 transition-all duration-200 font-medium relative group"
            >
              {t('features')}
              <span className={`absolute bottom-0 w-0 h-0.5 bg-orange-600 transition-all duration-200 group-hover:w-full ${isRTL ? 'right-0' : 'left-0'}`}></span>
            </a>
            <a 
              href="#roles" 
              className="text-gray-600 hover:text-orange-600 transition-all duration-200 font-medium relative group"
            >
              {t('forYou')}
              <span className={`absolute bottom-0 w-0 h-0.5 bg-orange-600 transition-all duration-200 group-hover:w-full ${isRTL ? 'right-0' : 'left-0'}`}></span>
            </a>
            <a 
              href="#testimonials" 
              className="text-gray-600 hover:text-orange-600 transition-all duration-200 font-medium relative group"
            >
              {t('reviews')}
              <span className={`absolute bottom-0 w-0 h-0.5 bg-orange-600 transition-all duration-200 group-hover:w-full ${isRTL ? 'right-0' : 'left-0'}`}></span>
            </a>
            <a 
              href="#pricing" 
              className="text-gray-600 hover:text-orange-600 transition-all duration-200 font-medium relative group"
            >
              {t('pricing')}
              <span className={`absolute bottom-0 w-0 h-0.5 bg-orange-600 transition-all duration-200 group-hover:w-full ${isRTL ? 'right-0' : 'left-0'}`}></span>
            </a>
          </nav>

          {/* Action Buttons */}
          <div className={`hidden md:flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
            <LanguageToggle />
            <button className="text-gray-600 hover:text-orange-600 transition-all duration-200 font-medium px-4 py-2 rounded-lg hover:bg-orange-50">
              {t('signIn')}
            </button>
            <button className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-2 rounded-full hover:from-orange-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium">
              {t('getStarted')}
            </button>
          </div>

          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-slideIn">
            <nav className="flex flex-col space-y-4">
              <a 
                href="#features" 
                className="text-gray-600 hover:text-orange-600 transition-all duration-200 font-medium py-2 px-4 rounded-lg hover:bg-orange-50"
              >
                {t('features')}
              </a>
              <a 
                href="#roles" 
                className="text-gray-600 hover:text-orange-600 transition-all duration-200 font-medium py-2 px-4 rounded-lg hover:bg-orange-50"
              >
                {t('forYou')}
              </a>
              <a 
                href="#testimonials" 
                className="text-gray-600 hover:text-orange-600 transition-all duration-200 font-medium py-2 px-4 rounded-lg hover:bg-orange-50"
              >
                {t('reviews')}
              </a>
              <a 
                href="#pricing" 
                className="text-gray-600 hover:text-orange-600 transition-all duration-200 font-medium py-2 px-4 rounded-lg hover:bg-orange-50"
              >
                {t('pricing')}
              </a>
              <div className="pt-4 border-t border-gray-200 space-y-4">
                <LanguageToggle />
                <button className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-full hover:from-orange-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg">
                  {t('getStarted')}
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
