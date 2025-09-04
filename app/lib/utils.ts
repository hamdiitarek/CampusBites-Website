import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
// Removed Firebase import since we're using Appwrite now

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'EGP', locale: string = 'en'): string {
  if (locale === 'ar') {
    return `${amount.toLocaleString('ar-EG')} جنيه`;
  }
  return `${amount.toLocaleString('en-US')} ${currency}`;
}

export function formatUniversityId(id: string): string {
  return id.replace(/^(\d{2})-(\d+)$/, '$1-$2');
}

/**
 * Safely formats a date from various sources (Firestore Timestamp, string, number, Date)
 */
export function formatDate(dateValue: any, options?: Intl.DateTimeFormatOptions): string {
  try {
    // Handle null/undefined
    if (!dateValue) return 'N/A';
    
    // Handle Firestore Timestamp
    if (dateValue && typeof dateValue.toDate === 'function') {
      return dateValue.toDate().toLocaleDateString(undefined, options);
    }
    
    // Handle string, number, or Date objects
    if (typeof dateValue === 'string' || typeof dateValue === 'number' || dateValue instanceof Date) {
      return new Date(dateValue).toLocaleDateString(undefined, options);
    }
    
    return 'N/A';
  } catch (error) {
    console.warn('Error formatting date:', error);
    return 'N/A';
  }
}
