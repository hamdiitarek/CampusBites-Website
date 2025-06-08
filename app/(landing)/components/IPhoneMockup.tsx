"use client";

import { useState, useEffect } from 'react';

interface IPhone16ProMockupProps {
  screenshots?: string[];
  currentIndex?: number;
  autoRotate?: boolean;
  rotateInterval?: number;
}

const IPhone16ProMockup = ({ 
  screenshots = [], 
  currentIndex = 0, 
  autoRotate = true,
  rotateInterval = 3000 
}: IPhone16ProMockupProps) => {
  const [activeIndex, setActiveIndex] = useState(currentIndex);

  useEffect(() => {
    if (autoRotate && screenshots.length > 1) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % screenshots.length);
      }, rotateInterval);
      
      return () => clearInterval(interval);
    }
  }, [autoRotate, screenshots.length, rotateInterval]);
  return (
    <div className="relative w-[320px] mx-auto">
      {/* iPhone 16 Pro Frame */}
      <div className="relative bg-gradient-to-b from-gray-800 to-black rounded-[3.5rem] p-2 shadow-2xl">
        {/* Dynamic Island */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-25 h-8 bg-black rounded-full z-10"></div>
        
        {/* Screen */}
        <div className="bg-black rounded-[3rem] overflow-hidden relative">
          {/* Screenshot Container */}
          <div className="relative w-full aspect-[9/19.5] bg-gray-100">
            {screenshots.length > 0 ? (
              <img
                src={screenshots[activeIndex]}
                alt={`App screenshot ${activeIndex + 1}`}
                className="w-full h-full object-cover object-top transition-opacity duration-500"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            
            {/* Placeholder when no screenshots */}
            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 ${screenshots.length > 0 ? 'hidden' : ''}`}>
              <div className="text-center px-8">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-3xl flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">CampusBites</h3>
                <p className="text-sm text-gray-500">App screenshots will appear here</p>
                <p className="text-xs text-gray-400 mt-2">Add your screenshots to the Hero component</p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      
      {/* Screenshot indicators */}
      {screenshots.length > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {screenshots.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? 'bg-orange-500 scale-110' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default IPhone16ProMockup;
