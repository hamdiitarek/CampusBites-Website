"use client";

import { Star, Quote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Testimonials = () => {
  const { t, isRTL } = useLanguage();
  
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: t('testimonial1Role'),
      university: "MIT",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b469?w=400&h=400&fit=crop&crop=face",
      content: t('testimonial1Content'),
      rating: 5
    },
    {
      name: "Ahmed Al-Rashid",
      role: t('testimonial2Role'),
      business: "Campus Café",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      content: t('testimonial2Content'),
      rating: 5
    },
    {
      name: "Dr. Emily Rodriguez",
      role: t('testimonial3Role'),
      university: "Stanford University",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
      content: t('testimonial3Content'),
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {t('lovedByThousands')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('lovedByThousandsDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className={`bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className={`flex items-center mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className={`w-14 h-14 rounded-full object-cover ${isRTL ? 'ml-4' : 'mr-4'}`}
                />
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-sm text-orange-600 font-medium">
                    {testimonial.university || testimonial.business}
                  </p>
                </div>
              </div>

              <div className={`flex mb-4 ${isRTL ? 'justify-end' : ''}`}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <div className="relative">
                <Quote className={`absolute -top-2 w-8 h-8 text-orange-200 ${isRTL ? '-right-2' : '-left-2'}`} />
                <p className={`text-gray-700 leading-relaxed ${isRTL ? 'pr-6' : 'pl-6'}`}>{testimonial.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
