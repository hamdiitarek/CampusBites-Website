import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "خصومات الطلاب مصر 2025 | عروض حصرية للجامعات المصرية CampusBites",
  description: "اوفر فلوسك مع أقوى عروض وخصومات الطلاب في مصر! خصم 25% على كل الطلبات من جامعة القاهرة والإسكندرية وعين شمس. كوبونات وعروض يومية حصرية للطلاب المصريين",
  keywords: [
    "خصومات طلاب مصر", "عروض جامعية", "كوبونات طعام طلاب",
    "خصم طلاب جامعة القاهرة", "عروض طعام جامعي", "كود خصم طلاب",
    "تخفيضات أكل جامعي", "عروض كانتين الجامعة", "خصومات حصرية طلاب"
  ]
};

export default function StudentDiscountsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              خصومات الطلاب المصريين 💰
            </span>
            <br />
            <span className="text-2xl md:text-3xl text-gray-600">
              وفر حتى 50% على طلباتك! 🎉
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            عروض حصرية وخصومات يومية للطلاب في كل الجامعات المصرية. اطلب أكلك بأقل الأسعار مع CampusBites!
          </p>

          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 rounded-2xl max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-bold mb-2">🔥 عرض محدود!</h2>
            <p className="text-lg">استخدم كود: <span className="bg-white text-red-500 px-3 py-1 rounded font-bold">STUDENT25</span></p>
            <p className="text-sm mt-2">خصم 25% على أول 3 طلبات - لفترة محدودة!</p>
          </div>
        </div>
      </section>

      {/* University-specific discounts */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            خصومات حسب الجامعة 🏛️
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                university: "جامعة القاهرة",
                discount: "30%",
                code: "CAIRO30",
                color: "from-blue-500 to-blue-600",
                description: "خصم على كل طلبات الكانتين والكافيتيريا",
                expires: "30 يونيو 2025"
              },
              {
                university: "جامعة الإسكندرية", 
                discount: "25%",
                code: "ALEX25",
                color: "from-cyan-500 to-blue-500",
                description: "عرض خاص على المأكولات البحرية والسي فود",
                expires: "31 يوليو 2025"
              },
              {
                university: "جامعة عين شمس",
                discount: "35%",
                code: "AINSHAMS35", 
                color: "from-orange-500 to-red-500",
                description: "خصم إضافي على الوجبات الصحية",
                expires: "15 أغسطس 2025"
              },
              {
                university: "جامعة حلوان",
                discount: "20%",
                code: "HELWAN20",
                color: "from-purple-500 to-pink-500", 
                description: "توصيل مجاني + خصم على كل الطلبات",
                expires: "31 ديسمبر 2025"
              },
              {
                university: "جامعة الزقازيق",
                discount: "40%",
                code: "ZAG40",
                color: "from-green-500 to-emerald-500",
                description: "أكبر خصم للطلاب الجدد",
                expires: "30 سبتمبر 2025"
              },
              {
                university: "جامعة المنصورة",
                discount: "28%", 
                code: "MANSOURA28",
                color: "from-indigo-500 to-purple-500",
                description: "خصم على العصائر والمشروبات الطازجة",
                expires: "31 أكتوبر 2025"
              }
            ].map((offer, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className={`bg-gradient-to-r ${offer.color} p-6 text-white text-center`}>
                  <h3 className="text-xl font-bold mb-2">{offer.university}</h3>
                  <div className="text-4xl font-bold mb-2">{offer.discount}</div>
                  <p className="text-sm opacity-90">خصم حصري</p>
                </div>
                
                <div className="p-6">
                  <div className="bg-gray-100 rounded-lg p-4 mb-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">كود الخصم:</p>
                    <p className="text-2xl font-bold text-gray-900 font-mono">{offer.code}</p>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{offer.description}</p>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>⏰ ينتهي في:</span>
                    <span className="font-medium">{offer.expires}</span>
                  </div>
                  
                  <button className={`w-full bg-gradient-to-r ${offer.color} text-white py-3 rounded-lg font-bold hover:opacity-90 transition-opacity`}>
                    استخدم الكود الآن! 🎉
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to use discounts */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            ازاي تستخدم كود الخصم؟ 🤔
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "اختار أكلك",
                description: "تصفح المطاعم واختار وجباتك المفضلة",
                icon: "🍽️"
              },
              {
                step: "2",
                title: "اضف للسلة", 
                description: "اضف كل اللي عايزه في عربة التسوق",
                icon: "🛒"
              },
              {
                step: "3",
                title: "اكتب الكود",
                description: "في صفحة الدفع اكتب كود الخصم",
                icon: "💳"
              },
              {
                step: "4",
                title: "وفر فلوسك!",
                description: "شوف الخصم اتطبق على طلبك",
                icon: "💰"
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-3xl">{step.icon}</span>
                </div>
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Daily deals section */}
      <section className="py-16 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            عروض اليوم الحارقة! 🔥
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                deal: "هابي أور",
                time: "2:00 - 4:00 م",
                discount: "خصم 40%",
                description: "على كل المشروبات والعصائر"
              },
              {
                deal: "وجبة الإفطار",
                time: "8:00 - 11:00 ص", 
                discount: "خصم 30%",
                description: "فول وطعمية وجبنة وعسل"
              },
              {
                deal: "عشاء الطلاب",
                time: "7:00 - 10:00 م",
                discount: "خصم 25%",
                description: "على كل الوجبات الرئيسية"
              }
            ].map((deal, index) => (
              <div key={index} className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-2xl font-bold mb-2">{deal.deal}</h3>
                <p className="text-lg mb-2">{deal.time}</p>
                <p className="text-3xl font-bold mb-2">{deal.discount}</p>
                <p className="text-sm opacity-90">{deal.description}</p>
              </div>
            ))}
          </div>
          
          <a 
            href="/"
            className="mt-8 inline-block bg-white text-orange-500 px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-colors"
          >
            شوف كل العروض! 👀
          </a>
        </div>
      </section>

      {/* Tips for saving money */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            نصايح توفير للطلاب الذكيين 🧠💡
          </h2>

          <div className="space-y-6">
            {[
              {
                tip: "اطلب مع صحابك",
                description: "لما تطلبوا مع بعض، هتحصلوا على خصم إضافي + توصيل مجاني",
                icon: "👥",
                savings: "وفر حتى 15 جنيه"
              },
              {
                tip: "استخدم العروض الأسبوعية",
                description: "كل أسبوع فيه عروض جديدة على مطاعم مختلفة",
                icon: "📅", 
                savings: "وفر 20-40%"
              },
              {
                tip: "اشترك في النشرة البريدية",
                description: "هتوصلك كوبونات حصرية وعروض خاصة قبل أي حد",
                icon: "📧",
                savings: "كوبونات بـ50 جنيه"
              },
              {
                tip: "استخدم النقاط",
                description: "كل طلب بيجيبلك نقاط تقدر تستخدمها في طلبات تانية",
                icon: "⭐",
                savings: "طلب مجاني كل شهر"
              }
            ].map((tip, index) => (
              <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{tip.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{tip.tip}</h3>
                    <p className="text-gray-600 mb-2">{tip.description}</p>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      {tip.savings}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ابدأ توفيرك النهاردة! 🚀
          </h2>
          <p className="text-xl mb-8">
            حمل التطبيق دلوقتي واحصل على خصم 30% على أول طلب
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/"
              className="inline-block bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-colors text-center"
            >
              📱 حمل التطبيق مجاناً
            </a>
            <a 
              href="/features"
              className="inline-block border-2 border-white text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white hover:text-purple-600 transition-all duration-200 text-center"
            >
              🎯 شوف العروض
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
