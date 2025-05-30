
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
        <div className={`flex justify-between items-center py-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className={`text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent ${isRTL ? 'mr-3' : 'ml-3'}`}>
              StudyConnect
            </span>
          </div>

          <nav className={`hidden md:flex space-x-8 ${isRTL ? 'space-x-reverse' : ''}`}>
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">{t('features')}</a>
            <a href="#roles" className="text-gray-600 hover:text-gray-900 transition-colors">{t('forYou')}</a>
            <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">{t('reviews')}</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">{t('pricing')}</a>
          </nav>

          <div className={`hidden md:flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
            <LanguageToggle />
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              {t('signIn')}
            </button>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105">
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
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">{t('features')}</a>
              <a href="#roles" className="text-gray-600 hover:text-gray-900 transition-colors">{t('forYou')}</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">{t('reviews')}</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">{t('pricing')}</a>
              <div className="pt-4 border-t border-gray-200">
                <LanguageToggle />
                <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-200">
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
