import { Client, Account, Databases, Storage, Functions, Teams } from 'appwrite';
import { DemoAccount, DemoDatabases, demoClient } from './demo/mockAppwrite';

/**
 * Demo mode (the default) runs the whole app against an in-browser copy of the
 * demo dataset, so the public deployment works without an Appwrite project.
 * Set NEXT_PUBLIC_DEMO_MODE=false and the Appwrite variables below to use a
 * real backend.
 */
export const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';

// Appwrite configuration
const appwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'campusbites-eg',
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main',
  // Collection IDs
  usersCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || 'users',
  vendorsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_VENDORS_COLLECTION_ID || 'vendors',
  ordersCollectionId: process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID || 'orders',
  universitiesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_UNIVERSITIES_COLLECTION_ID || 'universities',
  complaintsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_COMPLAINTS_COLLECTION_ID || 'complaints',
  notificationsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_NOTIFICATIONS_COLLECTION_ID || 'notifications',
  transactionsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_TRANSACTIONS_COLLECTION_ID || 'transactions',
  reviewsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID || 'reviews',
  oneTimeCodesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_ONE_TIME_CODES_COLLECTION_ID || 'oneTimeCodes',
  analyticsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_ANALYTICS_COLLECTION_ID || 'analytics',
  menusCollectionId: process.env.NEXT_PUBLIC_APPWRITE_MENUS_COLLECTION_ID || 'menus',
  categoriesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID || 'categories',
  menuItemsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_MENU_ITEMS_COLLECTION_ID || 'menuItems',
  // Storage bucket
  storageBucketId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || 'images'
};

const realClient = new Client().setEndpoint(appwriteConfig.endpoint).setProject(appwriteConfig.projectId);

// The demo stand-ins implement the subset of the SDK this app calls.
export const client = (isDemoMode ? demoClient : realClient) as unknown as Client;
export const account = (isDemoMode ? new DemoAccount() : new Account(realClient)) as unknown as Account;
export const databases = (isDemoMode ? new DemoDatabases() : new Databases(realClient)) as unknown as Databases;
export const storage = new Storage(realClient);
export const functions = new Functions(realClient);
export const teams = new Teams(realClient);

// Export configuration for use in other files
export { appwriteConfig };

export default client;
