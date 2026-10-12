import type { Metadata } from 'next';
import { Landing } from '@/components/site/Landing';

export const metadata: Metadata = {
  title: "كامبوس بايتس - تطبيق توصيل الطعام الجامعي | اطلب من مطاعم الجامعة",
  description: "اطلب من كافيهات وكافيتريات الجامعة، وادفع بالمحفظة أو كاش، واستلم لما يكون جاهز. ديمو لايف بلوحات تحكم للمطاعم والجامعة والمنصة.",
  keywords: [
    // Arabic keywords with Egyptian dialect
    "توصيل أكل جامعة القاهرة", "كانتين جامعة عين شمس", "طعام جامعة الاسكندرية",
    "أكل جامعة حلوان", "كافيتيريا جامعة الزقازيق", "مطاعم حرم جامعي مصر",
    "تطبيق طعام طلاب", "دليفري أكل كلية", "وجبات طلبة الجامعة",
    "أكل رخيص للطلاب", "عروض طعام جامعي", "فود ديليفري جامعات مصر",
    "طلب طعام اونلاين", "توصيل كانتين", "خدمة طعام طلابية"
  ],
  openGraph: {
    title: "كامبوس بايتس · اطلب من غير طابور",
    description: "طلب أكل لكافيتريات الجامعات المصرية، بلوحات تحكم لايف للمطاعم والجامعة والمنصة.",
    url: "https://campusbites.com/ar",
    locale: "ar_EG",
  },
  alternates: {
    canonical: "https://campusbites.com/ar",
    languages: {
      'en': 'https://campusbites.com/en',
      'x-default': 'https://campusbites.com',
    },
  }
};

export default function ArabicHome() {
  return <Landing lang="ar" />;
}
