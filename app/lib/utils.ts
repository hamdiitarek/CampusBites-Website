import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
