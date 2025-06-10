"use client";

import { useEffect, useState } from 'react';

interface ClientOnlyLayoutProps {
  children: React.ReactNode;
  isRTL: boolean;
  isEvenIndex: boolean;
  className?: string;
}

const ClientOnlyLayout: React.FC<ClientOnlyLayoutProps> = ({ 
  children, 
  isRTL, 
  isEvenIndex, 
  className = "" 
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR and initial render, use a neutral layout
  if (!mounted) {
    return (
      <div className={`flex flex-col lg:flex-row items-center gap-12 ${className}`}>
        {children}
      </div>
    );
  }

  // After hydration, apply RTL-aware ordering
  const contentOrder = isRTL ? (isEvenIndex ? 'lg:order-2' : 'lg:order-1') : (isEvenIndex ? 'lg:order-1' : 'lg:order-2');
  const imageOrder = isRTL ? (isEvenIndex ? 'lg:order-1' : 'lg:order-2') : (isEvenIndex ? 'lg:order-2' : 'lg:order-1');

  return (
    <div className={`flex flex-col lg:flex-row items-center gap-12 ${className}`}>
      {children}
    </div>
  );
};

export default ClientOnlyLayout;
