#!/usr/bin/env node
/**
 * Appwrite Schema Verification Script
 * Verifies that the Appwrite database schema is properly set up
 */

const { Client, Databases, Storage } = require('node-appwrite');
const dotenv = require('dotenv');
const { log, validateConfig } = require('./utils/logger.cjs');

// Load environment variables
dotenv.config({ path: '.env.local' });

// Configuration
const config = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  apiKey: process.env.APPWRITE_API_KEY,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main',
  collections: {
    users: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || 'users',
    vendors: process.env.NEXT_PUBLIC_APPWRITE_VENDORS_COLLECTION_ID || 'vendors',
    orders: process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID || 'orders',
    universities: process.env.NEXT_PUBLIC_APPWRITE_UNIVERSITIES_COLLECTION_ID || 'universities',
    complaints: process.env.NEXT_PUBLIC_APPWRITE_COMPLAINTS_COLLECTION_ID || 'complaints',
    notifications: process.env.NEXT_PUBLIC_APPWRITE_NOTIFICATIONS_COLLECTION_ID || 'notifications',
    transactions: process.env.NEXT_PUBLIC_APPWRITE_TRANSACTIONS_COLLECTION_ID || 'transactions',
    reviews: process.env.NEXT_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID || 'reviews',
    oneTimeCodes: process.env.NEXT_PUBLIC_APPWRITE_ONE_TIME_CODES_COLLECTION_ID || 'oneTimeCodes',
    analytics: process.env.NEXT_PUBLIC_APPWRITE_ANALYTICS_COLLECTION_ID || 'analytics'
  },
  storageBucketId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || 'images'
};

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId);

if (config.apiKey) {
  client.setKey(config.apiKey);
}

const databases = new Databases(client);
const storage = new Storage(client);

async function verifyConfiguration() {
  log('Verifying configuration...');
  
  try {
    validateConfig(config, ['projectId', 'apiKey']);
  } catch (error) {
    log('Configuration issues found:', 'error');
    log(`  - ${error.message}`, 'error');
    throw error;
  }
}

async function verifyDatabase() {
  try {
    log('Verifying database...');
    const database = await databases.get(config.databaseId);
    log(`✓ Database found: ${database.name} (${database.$id})`, 'success');
    return true;
  } catch (error) {
    log(`✗ Database verification failed: ${error.message}`, 'error');
    return false;
  }
}

async function verifyCollections() {
  try {
    log('Verifying collections...');
    const collections = await databases.listCollections(config.databaseId);
    const existingCollections = collections.collections.map(c => c.$id);
    
    let allFound = true;
    
    for (const [name, id] of Object.entries(config.collections)) {
      if (existingCollections.includes(id)) {
        log(`  ✓ ${name} collection found (${id})`, 'success');
      } else {
        log(`  ✗ ${name} collection missing (${id})`, 'error');
        allFound = false;
      }
    }
    
    return allFound;
  } catch (error) {
    log(`✗ Collections verification failed: ${error.message}`, 'error');
    return false;
  }
}

async function verifyCollectionAttributes() {
  try {
    log('Verifying collection attributes...');
    
    const requiredAttributes = {
      users: ['id', 'fullName', 'email', 'role', 'universityName'],
      vendors: ['id', 'name', 'userId', 'universityName', 'isApproved'],
      orders: ['id', 'userId', 'vendorId', 'status', 'total'],
      universities: ['id', 'name', 'emailDomain', 'isActive'],
      complaints: ['id', 'userId', 'vendorId', 'title', 'status'],
      notifications: ['id', 'userId', 'title', 'type', 'status'],
      transactions: ['id', 'userId', 'type', 'amount', 'status'],
      reviews: ['id', 'userId', 'vendorId', 'orderId', 'rating'],
      oneTimeCodes: ['id', 'code', 'type', 'universityId', 'isActive'],
      analytics: ['id', 'date', 'totalOrders', 'totalRevenue']
    };
    
    let allValid = true;
    
    for (const [collectionName, collectionId] of Object.entries(config.collections)) {
      if (requiredAttributes[collectionName]) {
        try {
          const collection = await databases.getCollection(config.databaseId, collectionId);
          const existingAttributes = collection.attributes.map(attr => attr.key);
          
          const missing = requiredAttributes[collectionName].filter(
            attr => !existingAttributes.includes(attr)
          );
          
          if (missing.length === 0) {
            log(`  ✓ ${collectionName} attributes verified`, 'success');
          } else {
            log(`  ✗ ${collectionName} missing attributes: ${missing.join(', ')}`, 'error');
            allValid = false;
          }
        } catch (error) {
          log(`  ✗ ${collectionName} attribute check failed: ${error.message}`, 'error');
          allValid = false;
        }
      }
    }
    
    return allValid;
  } catch (error) {
    log(`✗ Attribute verification failed: ${error.message}`, 'error');
    return false;
  }
}

async function verifyStorageBucket() {
  try {
    log('Verifying storage bucket...');
    const bucket = await storage.getBucket(config.storageBucketId);
    log(`✓ Storage bucket found: ${bucket.name} (${bucket.$id})`, 'success');
    return true;
  } catch (error) {
    log(`✗ Storage bucket verification failed: ${error.message}`, 'error');
    return false;
  }
}

async function generateReport() {
  log('');
  log('=== APPWRITE SCHEMA VERIFICATION REPORT ===', 'info');
  log('');
  
  const results = {
    configuration: false,
    database: false,
    collections: false,
    attributes: false,
    storage: false
  };
  
  try {
    // Verify configuration
    await verifyConfiguration();
    results.configuration = true;
    
    // Verify database
    results.database = await verifyDatabase();
    
    // Verify collections
    if (results.database) {
      results.collections = await verifyCollections();
      
      // Verify attributes if collections exist
      if (results.collections) {
        results.attributes = await verifyCollectionAttributes();
      }
    }
    
    // Verify storage
    results.storage = await verifyStorageBucket();
    
  } catch (error) {
    log(`Verification failed: ${error.message}`, 'error');
  }
  
  // Generate summary
  log('');
  log('=== SUMMARY ===', 'info');
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([check, passed]) => {
    const status = passed ? '✓' : '✗';
    const level = passed ? 'success' : 'error';
    log(`${status} ${check.charAt(0).toUpperCase() + check.slice(1)}`, level);
  });
  
  log('');
  log(`Overall Status: ${passed}/${total} checks passed`, passed === total ? 'success' : 'error');
  
  if (passed === total) {
    log('🎉 Appwrite schema is properly configured!', 'success');
    log('You can proceed to Phase 3: Authentication Migration', 'info');
  } else {
    log('❌ Schema setup is incomplete', 'error');
    log('Run "npm run appwrite:setup" to create missing components', 'info');
  }
  
  return passed === total;
}

async function main() {
  try {
    const success = await generateReport();
    process.exit(success ? 0 : 1);
  } catch (error) {
    log(`Verification failed: ${error.message}`, 'error');
    process.exit(1);
  }
}

main();