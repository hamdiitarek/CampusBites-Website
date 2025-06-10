import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "دليل الطعام الجامعي 2025 | أفضل كانتين ومطاعم الحرم الجامعي",
  description: "اكتشف أفضل أماكن الأكل في الجامعات! دليل شامل للكانتين والكافيتيريا والمطاعم الجامعية. نصائح للتوفير، أفضل الوجبات، وتقييمات الطلاب 2025",
  keywords: [
    "كانتين جامعي", "مطاعم الحرم الجامعي", "كافيتيريا الطلاب",
    "أكل رخيص جامعي", "طعام طلاب", "دليل مطاعم الجامعات",
    "أفضل أكل في الجامعة", "قوائم طعام جامعي", "وجبات طلابية"
  ]
};

export default function CampusFoodGuide() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <article className="prose prose-lg max-w-none">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              دليل الطعام الجامعي 2025 🍕
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              الدليل الشامل لأفضل أماكن الأكل في الحرم الجامعي - من الكانتين للمطاعم
            </p>
            <div className="flex justify-center">
              <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">
                آخر تحديث: يونيو 2025
              </span>
            </div>
          </header>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">🏛️ أنواع أماكن الأكل في الحرم الجامعي</h2>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">🍽️ الكانتين الرئيسي</h3>
              <p className="text-gray-700 mb-4">
                عادة ما يكون أرخص خيار في الجامعة! يقدم وجبات أساسية مثل الكشري والفول والطعمية والساندويتشات. 
                الأسعار تتراوح من 5-20 جنيه للوجبة الواحدة.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">أسعار مناسبة</span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">وجبات سريعة</span>
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">متاح دائماً</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">🍗 المطاعم الجامعية</h3>
              <p className="text-gray-700 mb-4">
                تقدم وجبات أكثر تنوعاً وجودة. فراخ مشوية، أرز بالخضار، سلطات طازجة، ومشروبات متنوعة. 
                الأسعار من 25-50 جنيه مع أماكن جلوس مريحة.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">وجبات كاملة</span>
                <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm">أماكن جلوس</span>
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">خدمة أفضل</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">☕ الكافيتيريات</h3>
              <p className="text-gray-700 mb-4">
                مثالية للمشروبات والوجبات الخفيفة. قهوة، شاي، عصائر طازجة، مخبوزات، وحلويات. 
                مكان ممتاز للدراسة والاستراحة بين المحاضرات.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">مشروبات ساخنة</span>
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">أجواء هادئة</span>
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">واي فاي</span>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">🥘 أشهر الوجبات الجامعية</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">🍛 الكشري</h3>
                <p className="text-gray-700">الوجبة الشعبية الأولى! رز وعدس ومكرونة مع الشطة والدقة. سعر متوسط: 12-18 جنيه</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">🥙 الفول والطعمية</h3>
                <p className="text-gray-700">فطار الطلاب المفضل! فول مدمس مع الطحينة والسلطة. سعر متوسط: 8-15 جنيه</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">🍗 الفراخ المشوية</h3>
                <p className="text-gray-700">وجبة مشبعة ولذيذة مع الأرز الأبيض أو البرغل. سعر متوسط: 30-45 جنيه</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">🥪 الساندويتشات</h3>
                <p className="text-gray-700">سريعة ومتنوعة: جبنة، بيض، لانشون، أو تونة. سعر متوسط: 10-25 جنيه</p>
              </div>
            </div>
          </section>

          <section className="mb-12 bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">💡 نصائح لتوفير المال في الجامعة</h2>
            
            <ul className="space-y-4 text-lg text-gray-700">
              <li className="flex items-start">
                <span className="text-2xl mr-3">🎯</span>
                <div>
                  <strong>استخدم تطبيق CampusBites:</strong> خصومات حصرية للطلاب تصل إلى 25% على كل الطلبات
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">⏰</span>
                <div>
                  <strong>اطلب في الأوقات المناسبة:</strong> عروض الهابي أور من 2-4 عصراً في معظم المطاعم
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">👥</span>
                <div>
                  <strong>اطلب مع الأصحاب:</strong> وجبات جماعية بأسعار مخفضة وتوصيل مجاني
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">📱</span>
                <div>
                  <strong>تابع العروض:</strong> إشعارات يومية بأحدث العروض والخصومات
                </div>
              </li>
            </ul>
          </section>

          <section className="text-center bg-gradient-to-r from-orange-500 to-red-600 text-white p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">جرب CampusBites دلوقتي! 🚀</h2>
            <p className="text-xl mb-6">
              اطلب من مطاعم جامعتك المفضلة بخصومات حصرية وتوصيل سريع
            </p>
            <a 
              href="/" 
              className="inline-block bg-white text-orange-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              حمل التطبيق مجاناً
            </a>
          </section>
        </article>

        {/* FAQ Schema for this page */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": "دليل الطعام الجامعي 2025",
              "description": "دليل شامل لأفضل أماكن الأكل في الحرم الجامعي",
              "author": {
                "@type": "Organization",
                "name": "CampusBites"
              },
              "publisher": {
                "@type": "Organization", 
                "name": "CampusBites",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://campusbites.com/logo.png"
                }
              },
              "datePublished": "2025-06-10",
              "dateModified": "2025-06-10"
            })
          }}
        />
      </div>
    </div>
  );
}
