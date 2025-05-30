
import { Bell, Search, Plus, Home, BookOpen, MessageCircle, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const IPhoneMockup = () => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="relative max-w-sm mx-auto">
      {/* iPhone Frame */}
      <div className="relative bg-black rounded-[3rem] p-2 shadow-2xl">
        {/* Screen */}
        <div className="bg-white rounded-[2.5rem] overflow-hidden">
          {/* Status Bar */}
          <div className="bg-gray-900 text-white px-6 py-2 flex justify-between items-center text-sm">
            <span>9:41</span>
            <div className="flex space-x-1">
              <div className="w-4 h-2 bg-white rounded-sm"></div>
              <div className="w-4 h-2 bg-white rounded-sm"></div>
              <div className="w-6 h-2 bg-white rounded-sm"></div>
            </div>
          </div>

          {/* App Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div>
                <h2 className="text-lg font-bold">{t('dashboard')}</h2>
                <p className="text-purple-100 text-sm">Good morning, Ahmed!</p>
              </div>
              <div className="relative">
                <Bell className="w-6 h-6" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-6 py-4 bg-gray-50">
            <div className={`flex items-center bg-white rounded-full px-4 py-2 shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Search className="w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder={isRTL ? "البحث في الدورات..." : "Search courses..."} 
                className={`flex-1 bg-transparent outline-none text-sm text-gray-600 ${isRTL ? 'mr-3 text-right' : 'ml-3'}`}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="px-6 py-2">
            <div className="grid grid-cols-4 gap-4">
              {[
                { icon: BookOpen, label: t('courses'), color: 'bg-blue-500' },
                { icon: Plus, label: t('assignments'), color: 'bg-green-500' },
                { icon: MessageCircle, label: t('messages'), color: 'bg-purple-500' },
                { icon: User, label: t('profile'), color: 'bg-orange-500' }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className={`${item.color} w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Courses */}
          <div className="px-6 py-4">
            <h3 className="font-bold text-gray-900 mb-3">{t('courses')}</h3>
            <div className="space-y-3">
              {[
                { title: t('mathematics'), progress: 75, color: 'bg-blue-500' },
                { title: t('physicsLab'), progress: 60, color: 'bg-green-500' },
                { title: t('computerScience'), progress: 90, color: 'bg-purple-500' }
              ].map((course, index) => (
                <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className={`flex items-center justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <h4 className="font-medium text-gray-900">{course.title}</h4>
                    <span className="text-sm text-gray-500">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${course.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="px-6 py-4">
            <h3 className="font-bold text-gray-900 mb-3">Recent Activity</h3>
            <div className="space-y-3">
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
                <div className={`flex-1 ${isRTL ? 'mr-3' : 'ml-3'}`}>
                  <p className="text-sm text-gray-900">{t('dueToday')}</p>
                  <p className="text-xs text-gray-500">Math Assignment #3</p>
                </div>
              </div>
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className={`flex-1 ${isRTL ? 'mr-3' : 'ml-3'}`}>
                  <p className="text-sm text-gray-900">{t('newMessage')}</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="bg-white border-t border-gray-200 px-6 py-3">
            <div className="flex justify-around">
              {[
                { icon: Home, active: true },
                { icon: BookOpen, active: false },
                { icon: MessageCircle, active: false },
                { icon: User, active: false }
              ].map((item, index) => (
                <button key={index} className="p-2">
                  <item.icon className={`w-6 h-6 ${item.active ? 'text-purple-600' : 'text-gray-400'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPhoneMockup;
