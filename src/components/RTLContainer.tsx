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

// Utility hooks for RTL-aware styling
export const useRTLClasses = () => {
  const { isRTL } = useLanguage();
  
  return {
    flexRow: isRTL ? 'flex-row-reverse' : 'flex-row',
    spaceX: (size: string) => isRTL ? `space-x-reverse space-x-${size}` : `space-x-${size}`,
    textAlign: isRTL ? 'text-right' : 'text-left',
    marginLeft: (size: string) => isRTL ? `mr-${size}` : `ml-${size}`,
    marginRight: (size: string) => isRTL ? `ml-${size}` : `mr-${size}`,
    paddingLeft: (size: string) => isRTL ? `pr-${size}` : `pl-${size}`,
    paddingRight: (size: string) => isRTL ? `pl-${size}` : `pr-${size}`,
    floatLeft: isRTL ? 'float-right' : 'float-left',
    floatRight: isRTL ? 'float-left' : 'float-right',
    borderLeft: isRTL ? 'border-r' : 'border-l',
    borderRight: isRTL ? 'border-l' : 'border-r',
    roundedLeft: isRTL ? 'rounded-r' : 'rounded-l',
    roundedRight: isRTL ? 'rounded-l' : 'rounded-r',
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
    <div className={`grid ${cols} ${className} ${isRTL ? 'text-right' : 'text-left'}`}>
      {children}
    </div>
  );
};

export default RTLContainer;
