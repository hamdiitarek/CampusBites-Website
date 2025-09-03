import { Client, Account, Databases, Storage, Functions, Teams } from 'appwrite';

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

// Initialize Appwrite client
export const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);
export const teams = new Teams(client);

// Export configuration for use in other files
export { appwriteConfig };

export default client;
