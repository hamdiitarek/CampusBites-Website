import type { Metadata } from 'next';
import { Landing } from '@/components/site/Landing';

export const metadata: Metadata = {
  title: "CampusBites - Campus Food Delivery App | Order Food from University Restaurants",
  description: "Order from campus cafés and food courts, pay by wallet or cash, and pick up when it’s ready. Live demo with vendor, university and platform dashboards.",
  keywords: [
    // English keywords for international students
    "campus food delivery egypt", "university food delivery", "student food app",
    "campus dining egypt", "college food delivery", "university restaurant delivery",
    "student meal delivery", "campus cafeteria delivery", "egyptian university food",
    "cairo university food", "alexandria university dining", "student discount food",
    "campus food ordering", "university canteen delivery", "student food service"
  ],
  openGraph: {
    title: "CampusBites · Skip the food-court queue",
    description: "Campus food ordering for Egyptian universities, with live vendor, university and platform dashboards.",
    url: "https://campusbites.com/en",
    locale: "en_US",
  },
  alternates: {
    canonical: "https://campusbites.com/en",
    languages: {
      'ar': 'https://campusbites.com/ar',
      'x-default': 'https://campusbites.com',
    },
  }
};

export default function EnglishHome() {
  return <Landing lang="en" />;
}
