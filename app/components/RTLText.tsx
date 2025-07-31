"use client";

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface RTLTextProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  spacing?: 'none' | 'tight' | 'normal' | 'wide';
  align?: 'auto' | 'left' | 'right' | 'center';
}

const RTLText: React.FC<RTLTextProps> = ({ 
  children, 
  className = '', 
  as: Component = 'div',
  spacing = 'normal',
  align = 'auto'
}) => {
  const { isRTL } = useLanguage();

  const getSpacingClass = () => {
    if (!isRTL || spacing === 'none') return '';
    
    switch (spacing) {
      case 'tight':
        return 'rtl-text-spacing-tight';
      case 'wide':
        return 'rtl-text-spacing-wide';
      default:
        return 'rtl-text-spacing';
    }
  };

  const getAlignmentClass = () => {
    if (align === 'center') return 'text-center';
    if (align === 'left') return 'text-left';
    if (align === 'right') return 'text-right';
    
    // Auto alignment based on RTL
    return isRTL ? 'text-right' : 'text-left';
  };

  const getDirectionClass = () => {
    return isRTL ? 'dir-rtl' : 'dir-ltr';
  };

  const combinedClassName = [
    className,
    isRTL ? 'font-arabic' : '',
    getSpacingClass(),
    getAlignmentClass(),
    getDirectionClass(),
    'paragraph-rtl'
  ].filter(Boolean).join(' ');

  return React.createElement(Component, { className: combinedClassName }, children);
};

interface RTLHeadingProps extends RTLTextProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const RTLHeading: React.FC<RTLHeadingProps> = ({ 
  level = 1, 
  children, 
  className = '',
  spacing = 'normal',
  align = 'auto'
}) => {
  const headingTag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <RTLText 
      as={headingTag} 
      className={className} 
      spacing={spacing}
      align={align}
    >
      {children}
    </RTLText>
  );
};

// RTLParagraphProps is intentionally the same as RTLTextProps
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface RTLParagraphProps extends RTLTextProps {}

export const RTLParagraph: React.FC<RTLParagraphProps> = ({ 
  children, 
  className = '',
  spacing = 'normal',
  align = 'auto'
}) => {
  return (
    <RTLText 
      as="p" 
      className={className} 
      spacing={spacing}
      align={align}
    >
      {children}
    </RTLText>
  );
};

interface RTLListProps {
  children: React.ReactNode;
  className?: string;
  type?: 'ul' | 'ol';
  spacing?: 'none' | 'tight' | 'normal' | 'wide';
}

export const RTLList: React.FC<RTLListProps> = ({ 
  children, 
  className = '',
  type = 'ul',
  spacing = 'normal'
}) => {
  const { isRTL } = useLanguage();

  const getSpacingClass = () => {
    if (!isRTL || spacing === 'none') return '';
    
    switch (spacing) {
      case 'tight':
        return 'rtl-text-spacing-tight';
      case 'wide':
        return 'rtl-text-spacing-wide';
      default:
        return 'rtl-text-spacing';
    }
  };

  const combinedClassName = [
    className,
    isRTL ? 'font-arabic' : '',
    getSpacingClass(),
    'list-rtl',
    isRTL ? 'text-right' : 'text-left'
  ].filter(Boolean).join(' ');

  return React.createElement(type, { className: combinedClassName }, children);
};

interface RTLButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'row' | 'column';
  gap?: 'sm' | 'md' | 'lg';
}

export const RTLButtonGroup: React.FC<RTLButtonGroupProps> = ({ 
  children, 
  className = '',
  direction = 'row',
  gap = 'md'
}) => {
  const gapClass = gap === 'sm' ? 'gap-2' : gap === 'lg' ? 'gap-6' : 'gap-4';
  const directionClass = direction === 'column' ? 'flex-col' : 'flex-row';
  
  const combinedClassName = [
    'btn-group-rtl',
    directionClass,
    gapClass,
    className
  ].filter(Boolean).join(' ');

  return <div className={combinedClassName}>{children}</div>;
};

interface RTLIconProps {
  children: React.ReactNode;
  position?: 'before' | 'after';
  className?: string;
}

export const RTLIcon: React.FC<RTLIconProps> = ({ 
  children, 
  position = 'before',
  className = ''
}) => {
  const positionClass = position === 'before' ? 'icon-before' : 'icon-after';
  
  return (
    <span className={`${positionClass} ${className}`}>
      {children}
    </span>
  );
};

export default RTLText;

// Utility components for mixed RTL/LTR content
export function EmailDisplay({ email, className = '' }: { email: string; className?: string }) {
  return (
    <span className={`preserve-ltr ${className}`}>
      {email}
    </span>
  );
}

export function PhoneDisplay({ phone, className = '' }: { phone: string; className?: string }) {
  return (
    <span className={`preserve-ltr ${className}`}>
      {phone}
    </span>
  );
}

export function UniversityIdDisplay({ universityId, className = '' }: { universityId: string; className?: string }) {
  return (
    <span className={`preserve-ltr ${className}`}>
      {universityId}
    </span>
  );
}

export function PreserveLTR({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`preserve-ltr ${className}`}>
      {children}
    </span>
  );
}
