
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import RoleSection from '@/components/RoleSection';
import Testimonials from '@/components/Testimonials';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <RoleSection />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
