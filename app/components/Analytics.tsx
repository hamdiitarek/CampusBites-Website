import Script from 'next/script'

export function Analytics() {
  return (
    <>
      {/* Google Analytics 4 */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          
          gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: document.title,
            page_location: window.location.href,
            language: document.documentElement.lang,
            custom_map: {
              'custom_parameter_1': 'user_type',
              'custom_parameter_2': 'university',
              'custom_parameter_3': 'language_preference'
            }
          });

          // Enhanced ecommerce tracking for food orders
          gtag('config', 'GA_MEASUREMENT_ID', {
            currency: 'EGP',
            enhanced_ecommerce: true
          });

          // Track language switches (important for Egyptian market)
          function trackLanguageChange(language) {
            gtag('event', 'language_change', {
              'event_category': 'User Interaction',
              'event_label': language,
              'custom_parameter_3': language
            });
          }
          
          // Track university selections (key for local SEO)
          function trackUniversitySelection(university) {
            gtag('event', 'university_selected', {
              'event_category': 'Location',
              'event_label': university,
              'custom_parameter_2': university
            });
          }

          // Make functions globally available
          window.trackLanguageChange = trackLanguageChange;
          window.trackUniversitySelection = trackUniversitySelection;
        `}
      </Script>

      {/* Facebook Pixel for Egyptian market */}
      <Script id="facebook-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          
          fbq('init', 'YOUR_PIXEL_ID');
          fbq('track', 'PageView');
          
          // Enhanced tracking for Egyptian users
          fbq('trackCustom', 'CampusPageView', {
            language: document.documentElement.lang,
            country: 'Egypt'
          });
        `}
      </Script>

      {/* Hotjar for user behavior analysis */}
      <Script id="hotjar" strategy="afterInteractive">
        {`
          (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:YOUR_HOTJAR_ID,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `}
      </Script>

      {/* Microsoft Clarity for additional insights */}
      <Script id="microsoft-clarity" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "YOUR_CLARITY_ID");
        `}
      </Script>

      {/* Schema.org for enhanced local business data */}
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FoodEstablishment",
            "name": "CampusBites Egypt",
            "alternateName": "كامبوس بايتس مصر",
            "description": "Egypt's leading campus food delivery platform",
            "url": "https://campusbites.com",
            "logo": "https://campusbites.com/logo.png",
            "image": [
              "https://campusbites.com/og-image.jpg",
              "https://campusbites.com/hero-image.jpg"
            ],
            "telephone": "+20-xxx-xxx-xxxx",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Main Campus Area",
              "addressLocality": "Cairo",
              "addressRegion": "Cairo Governorate",
              "postalCode": "12345",
              "addressCountry": "EG"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "30.0444",
              "longitude": "31.2357"
            },
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday", 
                  "Wednesday",
                  "Thursday",
                  "Sunday"
                ],
                "opens": "07:00",
                "closes": "23:00"
              },
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Friday", "Saturday"],
                "opens": "08:00", 
                "closes": "23:00"
              }
            ],
            "servesCuisine": [
              "Egyptian",
              "Middle Eastern", 
              "Mediterranean",
              "International",
              "Fast Food",
              "Healthy Food"
            ],
            "priceRange": "$",
            "acceptsReservations": false,
            "delivery": true,
            "takeaway": true,
            "paymentAccepted": [
              "Cash",
              "Credit Card",
              "Mobile Payment",
              "Bank Transfer"
            ],
            "currenciesAccepted": "EGP",
            "areaServed": [
              {
                "@type": "City",
                "name": "Cairo"
              },
              {
                "@type": "City", 
                "name": "Alexandria"
              },
              {
                "@type": "City",
                "name": "Giza"
              }
            ],
            "serviceArea": {
              "@type": "GeoCircle",
              "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": "30.0444",
                "longitude": "31.2357"
              },
              "geoRadius": "50000"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "15847",
              "bestRating": "5",
              "worstRating": "1"
            },
            "review": [
              {
                "@type": "Review",
                "author": {
                  "@type": "Person",
                  "name": "أحمد محمد"
                },
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5"
                },
                "reviewBody": "تطبيق ممتاز للطلاب! توصيل سريع وأسعار معقولة"
              }
            ],
            "sameAs": [
              "https://www.facebook.com/campusbites.egypt",
              "https://www.instagram.com/campusbites.eg",
              "https://twitter.com/campusbites_eg",
              "https://www.linkedin.com/company/campusbites"
            ]
          })
        }}
      />
    </>
  )
}
