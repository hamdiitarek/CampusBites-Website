#!/usr/bin/env node
/**
 * Appwrite Database Schema Setup Script
 * Phase 2 of Firebase to Appwrite Migration
 * 
 * This script sets up the complete Appwrite database schema including:
 * - Database creation
 * - Collection creation with attributes
 * - Permissions configuration
 * - Storage bucket setup
 * - Index creation for performance
 */

const { Client, Databases, Storage, Permission, Role, ID } = require('appwrite');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

// Configuration
const config = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  apiKey: process.env.APPWRITE_API_KEY, // Server API key needed for admin operations
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

// Collection schemas
const schemas = {
  users: {
    name: 'Users',
    permissions: [
      Permission.create(Role.users()),
      Permission.read(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users())
    ],
    attributes: [
      { key: 'id', type: 'string', size: 36, required: true },
      { key: 'fullName', type: 'string', size: 255, required: true },
      { key: 'email', type: 'string', size: 255, required: true },
      { key: 'universityId', type: 'string', size: 100, required: true },
      { key: 'universityName', type: 'string', size: 255, required: true },
      { key: 'phoneNumber', type: 'string', size: 20, required: false },
      { key: 'isEmailVerified', type: 'boolean', required: true, default: false },
      { key: 'role', type: 'enum', elements: ['student', 'vendor', 'admin', 'super-admin'], required: true },
      { key: 'walletBalance', type: 'float', required: true, default: 0 },
      { key: 'profileImageUrl', type: 'url', required: false },
      { key: 'fcmToken', type: 'string', size: 255, required: false }
    ],
    indexes: [
      { key: 'email_index', type: 'unique', attributes: ['email'] },
      { key: 'university_index', type: 'key', attributes: ['universityName'] },
      { key: 'role_index', type: 'key', attributes: ['role'] }
    ]
  },

  vendors: {
    name: 'Vendors',
    permissions: [
      Permission.create(Role.users()),
      Permission.read(Role.any()),
      Permission.update(Role.users()),
      Permission.delete(Role.users('admin'), Role.users('super-admin'))
    ],
    attributes: [
      { key: 'id', type: 'string', size: 36, required: true },
      { key: 'name', type: 'string', size: 255, required: true },
      { key: 'userId', type: 'string', size: 36, required: true },
      { key: 'universityId', type: 'string', size: 100, required: true },
      { key: 'universityName', type: 'string', size: 255, required: true },
      { key: 'description', type: 'string', size: 1000, required: true },
      { key: 'imageUrl', type: 'url', required: false },
      { key: 'rating', type: 'float', required: true, default: 0, min: 0, max: 5 },
      { key: 'reviewCount', type: 'integer', required: true, default: 0, min: 0 },
      { key: 'categories', type: 'string', size: 500, required: true, array: true },
      { key: 'isOpen', type: 'boolean', required: true, default: true },
      { key: 'isApproved', type: 'boolean', required: true, default: false },
      { key: 'isSuspended', type: 'boolean', required: true, default: false }
    ],
    indexes: [
      { key: 'user_index', type: 'unique', attributes: ['userId'] },
      { key: 'university_index', type: 'key', attributes: ['universityName'] },
      { key: 'status_index', type: 'key', attributes: ['isApproved', 'isSuspended'] },
      { key: 'categories_index', type: 'fulltext', attributes: ['categories'] }
    ]
  },

  orders: {
    name: 'Orders',
    permissions: [
      Permission.create(Role.users()),
      Permission.read(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users('admin'), Role.users('super-admin'))
    ],
    attributes: [
      { key: 'id', type: 'string', size: 36, required: true },
      { key: 'userId', type: 'string', size: 36, required: true },
      { key: 'vendorId', type: 'string', size: 36, required: true },
      { key: 'items', type: 'string', size: 5000, required: true }, // JSON string of OrderItem[]
      { key: 'total', type: 'float', required: true, min: 0 },
      { key: 'status', type: 'enum', elements: ['pending', 'confirmed', 'ready', 'completed', 'cancelled'], required: true },
      { key: 'paymentMethod', type: 'enum', elements: ['Wallet', 'Cash'], required: true },
      { key: 'confirmedAt', type: 'datetime', required: false },
      { key: 'readyAt', type: 'datetime', required: false },
      { key: 'completedAt', type: 'datetime', required: false },
      { key: 'cancelledAt', type: 'datetime', required: false },
      { key: 'statusHistory', type: 'string', size: 2000, required: false }, // JSON string
      { key: 'estimatedReadyTime', type: 'datetime', required: false },
      { key: 'customerNote', type: 'string', size: 500, required: false }
    ],
    indexes: [
      { key: 'user_index', type: 'key', attributes: ['userId'] },
      { key: 'vendor_index', type: 'key', attributes: ['vendorId'] },
      { key: 'status_index', type: 'key', attributes: ['status'] },
      { key: 'created_index', type: 'key', attributes: ['$createdAt'] }
    ]
  },

  universities: {
    name: 'Universities',
    permissions: [
      Permission.read(Role.any()),
      Permission.create(Role.users('admin'), Role.users('super-admin')),
      Permission.update(Role.users('admin'), Role.users('super-admin')),
      Permission.delete(Role.users('super-admin'))
    ],
    attributes: [
      { key: 'id', type: 'string', size: 36, required: true },
      { key: 'name', type: 'string', size: 255, required: true },
      { key: 'nameAr', type: 'string', size: 255, required: false },
      { key: 'emailDomain', type: 'string', size: 100, required: true },
      { key: 'city', type: 'string', size: 100, required: false },
      { key: 'cityAr', type: 'string', size: 100, required: false },
      { key: 'address', type: 'string', size: 500, required: false },
      { key: 'addressAr', type: 'string', size: 500, required: false },
      { key: 'phone', type: 'string', size: 20, required: false },
      { key: 'website', type: 'url', required: false },
      { key: 'isActive', type: 'boolean', required: true, default: true }
    ],
    indexes: [
      { key: 'domain_index', type: 'unique', attributes: ['emailDomain'] },
      { key: 'name_index', type: 'key', attributes: ['name'] },
      { key: 'active_index', type: 'key', attributes: ['isActive'] }
    ]
  },

  complaints: {
    name: 'Complaints',
    permissions: [
      Permission.create(Role.users()),
      Permission.read(Role.users()),
      Permission.update(Role.users('admin'), Role.users('super-admin')),
      Permission.delete(Role.users('admin'), Role.users('super-admin'))
    ],
    attributes: [
      { key: 'id', type: 'string', size: 36, required: true },
      { key: 'userId', type: 'string', size: 36, required: true },
      { key: 'vendorId', type: 'string', size: 36, required: true },
      { key: 'orderId', type: 'string', size: 36, required: false },
      { key: 'title', type: 'string', size: 200, required: true },
      { key: 'description', type: 'string', size: 1000, required: true },
      { key: 'status', type: 'enum', elements: ['pending', 'in_progress', 'resolved', 'closed'], required: true },
      { key: 'priority', type: 'enum', elements: ['low', 'medium', 'high'], required: false },
      { key: 'resolvedAt', type: 'datetime', required: false },
      { key: 'resolution', type: 'string', size: 1000, required: false },
      { key: 'adminId', type: 'string', size: 36, required: false },
      { key: 'attachments', type: 'string', size: 1000, required: false } // JSON array of URLs
    ],
    indexes: [
      { key: 'user_index', type: 'key', attributes: ['userId'] },
      { key: 'vendor_index', type: 'key', attributes: ['vendorId'] },
      { key: 'status_index', type: 'key', attributes: ['status'] },
      { key: 'priority_index', type: 'key', attributes: ['priority'] }
    ]
  },

  notifications: {
    name: 'Notifications',
    permissions: [
      Permission.create(Role.users('admin'), Role.users('super-admin')),
      Permission.read(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users())
    ],
    attributes: [
      { key: 'id', type: 'string', size: 36, required: true },
      { key: 'userId', type: 'string', size: 36, required: true },
      { key: 'title', type: 'string', size: 255, required: true },
      { key: 'body', type: 'string', size: 1000, required: true },
      { key: 'type', type: 'enum', elements: ['order', 'payment', 'promotion', 'system', 'complaint'], required: true },
      { key: 'status', type: 'enum', elements: ['sent', 'delivered', 'read', 'failed'], required: true },
      { key: 'data', type: 'string', size: 2000, required: false }, // JSON object
      { key: 'readAt', type: 'datetime', required: false },
      { key: 'expiresAt', type: 'datetime', required: false }
    ],
    indexes: [
      { key: 'user_index', type: 'key', attributes: ['userId'] },
      { key: 'status_index', type: 'key', attributes: ['status'] },
      { key: 'type_index', type: 'key', attributes: ['type'] },
      { key: 'created_index', type: 'key', attributes: ['$createdAt'] }
    ]
  },

  transactions: {
    name: 'Transactions',
    permissions: [
      Permission.create(Role.users()),
      Permission.read(Role.users()),
      Permission.update(Role.users('admin'), Role.users('super-admin')),
      Permission.delete(Role.users('super-admin'))
    ],
    attributes: [
      { key: 'id', type: 'string', size: 36, required: true },
      { key: 'userId', type: 'string', size: 36, required: true },
      { key: 'type', type: 'enum', elements: ['deposit', 'withdrawal', 'order_payment', 'refund', 'admin_adjustment'], required: true },
      { key: 'amount', type: 'float', required: true },
      { key: 'description', type: 'string', size: 500, required: true },
      { key: 'status', type: 'enum', elements: ['pending', 'completed', 'failed', 'cancelled'], required: true },
      { key: 'orderId', type: 'string', size: 36, required: false },
      { key: 'paymentMethod', type: 'string', size: 50, required: false },
      { key: 'externalTransactionId', type: 'string', size: 255, required: false },
      { key: 'completedAt', type: 'datetime', required: false },
      { key: 'metadata', type: 'string', size: 2000, required: false } // JSON object
    ],
    indexes: [
      { key: 'user_index', type: 'key', attributes: ['userId'] },
      { key: 'type_index', type: 'key', attributes: ['type'] },
      { key: 'status_index', type: 'key', attributes: ['status'] },
      { key: 'order_index', type: 'key', attributes: ['orderId'] }
    ]
  },

  reviews: {
    name: 'Reviews',
    permissions: [
      Permission.create(Role.users()),
      Permission.read(Role.any()),
      Permission.update(Role.users()),
      Permission.delete(Role.users())
    ],
    attributes: [
      { key: 'id', type: 'string', size: 36, required: true },
      { key: 'userId', type: 'string', size: 36, required: true },
      { key: 'vendorId', type: 'string', size: 36, required: true },
      { key: 'orderId', type: 'string', size: 36, required: true },
      { key: 'rating', type: 'integer', required: true, min: 1, max: 5 },
      { key: 'comment', type: 'string', size: 1000, required: false },
      { key: 'isPublic', type: 'boolean', required: true, default: true }
    ],
    indexes: [
      { key: 'user_index', type: 'key', attributes: ['userId'] },
      { key: 'vendor_index', type: 'key', attributes: ['vendorId'] },
      { key: 'order_index', type: 'unique', attributes: ['orderId'] },
      { key: 'rating_index', type: 'key', attributes: ['rating'] }
    ]
  },

  oneTimeCodes: {
    name: 'One Time Codes',
    permissions: [
      Permission.create(Role.users('super-admin')),
      Permission.read(Role.users('super-admin')),
      Permission.update(Role.users('super-admin')),
      Permission.delete(Role.users('super-admin'))
    ],
    attributes: [
      { key: 'id', type: 'string', size: 36, required: true },
      { key: 'code', type: 'string', size: 20, required: true },
      { key: 'type', type: 'enum', elements: ['vendor', 'admin'], required: true },
      { key: 'universityId', type: 'string', size: 100, required: true },
      { key: 'universityName', type: 'string', size: 255, required: true },
      { key: 'createdBy', type: 'string', size: 36, required: true },
      { key: 'expiresAt', type: 'datetime', required: true },
      { key: 'usedAt', type: 'datetime', required: false },
      { key: 'usedBy', type: 'string', size: 36, required: false },
      { key: 'isActive', type: 'boolean', required: true, default: true },
      { key: 'maxUses', type: 'integer', required: true, default: 1, min: 1 },
      { key: 'usageCount', type: 'integer', required: true, default: 0, min: 0 },
      { key: 'metadata', type: 'string', size: 2000, required: false } // JSON object
    ],
    indexes: [
      { key: 'code_index', type: 'unique', attributes: ['code'] },
      { key: 'university_index', type: 'key', attributes: ['universityId'] },
      { key: 'type_index', type: 'key', attributes: ['type'] },
      { key: 'active_index', type: 'key', attributes: ['isActive'] }
    ]
  },

  analytics: {
    name: 'Analytics',
    permissions: [
      Permission.create(Role.users('admin'), Role.users('super-admin')),
      Permission.read(Role.users('admin'), Role.users('super-admin')),
      Permission.update(Role.users('admin'), Role.users('super-admin')),
      Permission.delete(Role.users('super-admin'))
    ],
    attributes: [
      { key: 'id', type: 'string', size: 36, required: true },
      { key: 'date', type: 'string', size: 10, required: true }, // YYYY-MM-DD format
      { key: 'totalOrders', type: 'integer', required: true, default: 0, min: 0 },
      { key: 'totalRevenue', type: 'float', required: true, default: 0, min: 0 },
      { key: 'averageOrderValue', type: 'float', required: true, default: 0, min: 0 },
      { key: 'completionRate', type: 'float', required: true, default: 0, min: 0, max: 100 },
      { key: 'vendorId', type: 'string', size: 36, required: false },
      { key: 'universityId', type: 'string', size: 100, required: false }
    ],
    indexes: [
      { key: 'date_index', type: 'key', attributes: ['date'] },
      { key: 'vendor_index', type: 'key', attributes: ['vendorId'] },
      { key: 'university_index', type: 'key', attributes: ['universityId'] }
    ]
  }
};

// Helper functions
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    warning: '\x1b[33m', // Yellow
    error: '\x1b[31m',   // Red
    reset: '\x1b[0m'     // Reset
  };
  
  console.log(`${colors[level]}[${timestamp}] ${message}${colors.reset}`);
}

async function createDatabase() {
  try {
    log('Creating database...');
    await databases.create(config.databaseId, 'Campus Bites Database');
    log('Database created successfully', 'success');
  } catch (error) {
    if (error.code === 409) {
      log('Database already exists, skipping creation', 'warning');
    } else {
      throw error;
    }
  }
}

async function createCollection(collectionId, schema) {
  try {
    log(`Creating collection: ${schema.name}`);
    
    // Create collection
    await databases.createCollection(
      config.databaseId,
      collectionId,
      schema.name,
      schema.permissions,
      false, // documentSecurity
      true   // enabled
    );
    
    log(`Collection ${schema.name} created successfully`, 'success');
    
    // Create attributes
    for (const attr of schema.attributes) {
      await createAttribute(collectionId, attr);
    }
    
    // Create indexes
    if (schema.indexes) {
      for (const index of schema.indexes) {
        await createIndex(collectionId, index);
      }
    }
    
  } catch (error) {
    if (error.code === 409) {
      log(`Collection ${schema.name} already exists, skipping creation`, 'warning');
    } else {
      throw error;
    }
  }
}

async function createAttribute(collectionId, attr) {
  try {
    log(`  Creating attribute: ${attr.key} (${attr.type})`);
    
    switch (attr.type) {
      case 'string':
        await databases.createStringAttribute(
          config.databaseId,
          collectionId,
          attr.key,
          attr.size,
          attr.required,
          attr.default,
          attr.array || false
        );
        break;
        
      case 'integer':
        await databases.createIntegerAttribute(
          config.databaseId,
          collectionId,
          attr.key,
          attr.required,
          attr.min,
          attr.max,
          attr.default,
          attr.array || false
        );
        break;
        
      case 'float':
        await databases.createFloatAttribute(
          config.databaseId,
          collectionId,
          attr.key,
          attr.required,
          attr.min,
          attr.max,
          attr.default,
          attr.array || false
        );
        break;
        
      case 'boolean':
        await databases.createBooleanAttribute(
          config.databaseId,
          collectionId,
          attr.key,
          attr.required,
          attr.default,
          attr.array || false
        );
        break;
        
      case 'datetime':
        await databases.createDatetimeAttribute(
          config.databaseId,
          collectionId,
          attr.key,
          attr.required,
          attr.default,
          attr.array || false
        );
        break;
        
      case 'email':
        await databases.createEmailAttribute(
          config.databaseId,
          collectionId,
          attr.key,
          attr.required,
          attr.default,
          attr.array || false
        );
        break;
        
      case 'url':
        await databases.createUrlAttribute(
          config.databaseId,
          collectionId,
          attr.key,
          attr.required,
          attr.default,
          attr.array || false
        );
        break;
        
      case 'enum':
        await databases.createEnumAttribute(
          config.databaseId,
          collectionId,
          attr.key,
          attr.elements,
          attr.required,
          attr.default,
          attr.array || false
        );
        break;
        
      default:
        log(`Unknown attribute type: ${attr.type}`, 'warning');
    }
    
    // Wait a bit to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
    
  } catch (error) {
    if (error.code === 409) {
      log(`  Attribute ${attr.key} already exists, skipping`, 'warning');
    } else {
      log(`  Error creating attribute ${attr.key}: ${error.message}`, 'error');
      throw error;
    }
  }
}

async function createIndex(collectionId, index) {
  try {
    log(`  Creating index: ${index.key}`);
    
    await databases.createIndex(
      config.databaseId,
      collectionId,
      index.key,
      index.type,
      index.attributes,
      index.orders || []
    );
    
    // Wait a bit to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
    
  } catch (error) {
    if (error.code === 409) {
      log(`  Index ${index.key} already exists, skipping`, 'warning');
    } else {
      log(`  Error creating index ${index.key}: ${error.message}`, 'error');
      throw error;
    }
  }
}

async function createStorageBucket() {
  try {
    log('Creating storage bucket...');
    
    await storage.createBucket(
      config.storageBucketId,
      'Campus Bites Images',
      [
        Permission.create(Role.users()),
        Permission.read(Role.any()),
        Permission.update(Role.users()),
        Permission.delete(Role.users())
      ],
      false, // fileSecurity
      true,  // enabled
      5 * 1024 * 1024, // maxFileSize (5MB)
      ['jpg', 'jpeg', 'png', 'gif', 'webp'], // allowedFileExtensions
      'none', // compression
      false, // encryption
      false  // antivirus
    );
    
    log('Storage bucket created successfully', 'success');
    
  } catch (error) {
    if (error.code === 409) {
      log('Storage bucket already exists, skipping creation', 'warning');
    } else {
      throw error;
    }
  }
}

async function verifySetup() {
  log('Verifying setup...');
  
  try {
    // Check database
    const database = await databases.get(config.databaseId);
    log(`✓ Database verified: ${database.name}`);
    
    // Check collections
    const collections = await databases.listCollections(config.databaseId);
    const collectionIds = collections.collections.map(c => c.$id);
    
    for (const [key, collectionId] of Object.entries(config.collections)) {
      if (collectionIds.includes(collectionId)) {
        log(`✓ Collection verified: ${key} (${collectionId})`);
      } else {
        log(`✗ Collection missing: ${key} (${collectionId})`, 'error');
      }
    }
    
    // Check storage bucket
    const bucket = await storage.getBucket(config.storageBucketId);
    log(`✓ Storage bucket verified: ${bucket.name}`);
    
    log('Setup verification completed', 'success');
    
  } catch (error) {
    log(`Verification failed: ${error.message}`, 'error');
    throw error;
  }
}

async function main() {
  try {
    log('Starting Appwrite Schema Setup (Phase 2)', 'info');
    log(`Project ID: ${config.projectId}`);
    log(`Database ID: ${config.databaseId}`);
    
    // Validate configuration
    if (!config.projectId) {
      throw new Error('NEXT_PUBLIC_APPWRITE_PROJECT_ID is required');
    }
    
    if (!config.apiKey) {
      throw new Error('APPWRITE_API_KEY is required for schema setup');
    }
    
    // Create database
    await createDatabase();
    
    // Create collections
    for (const [collectionId, schema] of Object.entries(schemas)) {
      const actualCollectionId = config.collections[collectionId];
      if (actualCollectionId) {
        await createCollection(actualCollectionId, schema);
      } else {
        log(`Warning: No collection ID configured for ${collectionId}`, 'warning');
      }
    }
    
    // Create storage bucket
    await createStorageBucket();
    
    // Verify setup
    await verifySetup();
    
    log('✅ Appwrite Schema Setup completed successfully!', 'success');
    log('');
    log('Next steps:');
    log('1. Update your .env.local file with the correct collection IDs');
    log('2. Test the setup using the verification script');
    log('3. Begin Phase 3: Authentication Migration');
    
  } catch (error) {
    log(`❌ Setup failed: ${error.message}`, 'error');
    console.error(error);
    process.exit(1);
  }
}

// Handle command line arguments
const command = process.argv[2];

switch (command) {
  case 'verify':
    verifySetup().catch(error => {
      log(`Verification failed: ${error.message}`, 'error');
      process.exit(1);
    });
    break;
    
  case 'setup':
  default:
    main();
    break;
}