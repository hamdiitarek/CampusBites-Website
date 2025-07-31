import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface RTLContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

// Higher-order component for RTL-aware containers
const RTLContainer: React.FC<RTLContainerProps> = ({ 
  children, 
  className = '', 
  as: Component = 'div' 
}) => {
  const { isRTL } = useLanguage();
  
  return (
    <Component 
      className={`${className} ${isRTL ? 'font-arabic' : ''}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {children}
    </Component>
  );
};

// Utility hooks for RTL-aware styling using logical properties
export const useRTLClasses = () => {
  const { isRTL } = useLanguage();
  
  return {
    flexRow: isRTL ? 'flex-row-reverse' : 'flex-row',
    spaceX: (size: string) => isRTL ? `space-x-reverse space-x-${size}` : `space-x-${size}`,
    textAlign: 'text-start', // Use logical property
    textAlignCenter: 'text-center',
    textAlignEnd: 'text-end', // Use logical property
    marginStart: (size: string) => `ms-${size}`, // Using Tailwind's logical margin
    marginEnd: (size: string) => `me-${size}`, // Using Tailwind's logical margin
    paddingStart: (size: string) => `ps-${size}`, // Using Tailwind's logical padding
    paddingEnd: (size: string) => `pe-${size}`, // Using Tailwind's logical padding
    floatStart: isRTL ? 'float-right' : 'float-left',
    floatEnd: isRTL ? 'float-left' : 'float-right',
    borderStart: isRTL ? 'border-r' : 'border-l',
    borderEnd: isRTL ? 'border-l' : 'border-r',
    roundedStart: isRTL ? 'rounded-r' : 'rounded-l',
    roundedEnd: isRTL ? 'rounded-l' : 'rounded-r',
  };
};

// RTL-aware flex component
export const RTLFlex: React.FC<{
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  style?: React.CSSProperties;
}> = ({ children, className = '', reverse = false, style }) => {
  const { isRTL } = useLanguage();
  const shouldReverse = reverse ? !isRTL : isRTL;
  
  return (
    <div className={`flex ${shouldReverse ? 'flex-row-reverse' : 'flex-row'} ${className}`} style={style}>
      {children}
    </div>
  );
};

// RTL-aware grid component
export const RTLGrid: React.FC<{
  children: React.ReactNode;
  className?: string;
  cols?: string;
}> = ({ children, className = '', cols = 'grid-cols-1' }) => {
  const { isRTL } = useLanguage();
  
  return (
    <div className={`grid ${cols} ${className} text-start`}>
      {children}
    </div>
  );
};

export default RTLContainer;
