#!/usr/bin/env node
/**
 * Demo data setup script for Appwrite - Egypt University of Informatics
 * This script creates demo data for all tables in Appwrite collections
 */

import { Client, Databases, Account, ID } from 'node-appwrite';
import dotenv from 'dotenv';

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
  }
};

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId);

if (config.apiKey) {
  client.setKey(config.apiKey);
}

const databases = new Databases(client);
const account = new Account(client);

const UNIVERSITY_NAME = 'Egypt University of Informatics';
const UNIVERSITY_ID = '46676685-c590-40b4-ba8d-03c26a3c2ceb';
const EMAIL_DOMAIN = 'students.eui.edu.eg';

// Demo data
const demoData = {
  // University data
  university: {
    id: UNIVERSITY_ID,
    name: UNIVERSITY_NAME,
    emailDomain: EMAIL_DOMAIN,
    isActive: true
  },

  // Demo users
  users: [
    {
      id: 'demo-student-1',
      fullName: 'Ahmed Hassan',
      email: 'ahmed.hassan@students.eui.edu.eg',
      universityId: 'ST2024001',
      universityName: UNIVERSITY_NAME,
      phoneNumber: '+201234567890',
      isEmailVerified: true,
      role: 'student',
      walletBalance: 150.0,
      profileImageUrl: ''
    },
    {
      id: 'demo-student-2', 
      fullName: 'Sara Mohamed',
      email: 'sara.mohamed@students.eui.edu.eg',
      universityId: 'ST2024002',
      universityName: UNIVERSITY_NAME,
      phoneNumber: '+201234567891',
      isEmailVerified: true,
      role: 'student',
      walletBalance: 200.0,
      profileImageUrl: ''
    },
    {
      id: 'demo-vendor-1',
      fullName: 'Mohamed Ali',
      email: 'vendor.cafe@students.eui.edu.eg',
      universityId: 'V2024001',
      universityName: UNIVERSITY_NAME,
      phoneNumber: '+201234567892',
      isEmailVerified: true,
      role: 'vendor',
      walletBalance: 500.0,
      profileImageUrl: ''
    },
    {
      id: 'demo-admin-1',
      fullName: 'Dr. Amina Khalil',
      email: 'admin@students.eui.edu.eg', 
      universityId: 'AD2024001',
      universityName: UNIVERSITY_NAME,
      phoneNumber: '+201234567893',
      isEmailVerified: true,
      role: 'admin',
      walletBalance: 0.0,
      profileImageUrl: ''
    }
  ],

  // Demo vendors
  vendors: [
    {
      id: 'demo-vendor-1',
      name: 'قهوة الجامعة - University Café',
      userId: 'demo-vendor-1',
      universityId: UNIVERSITY_ID,
      universityName: UNIVERSITY_NAME,
      description: 'أفضل قهوة وساندوتشات في الحرم الجامعي - Best coffee and sandwiches on campus',
      imageUrl: '',
      rating: 4.5,
      reviewCount: 42,
      categories: ['Coffee', 'Sandwiches', 'Pastries'],
      isOpen: true,
      isApproved: true,
      isSuspended: false
    },
    {
      id: 'demo-vendor-2',
      name: 'مطعم الطلاب - Students Restaurant',
      userId: 'demo-vendor-2',
      universityId: UNIVERSITY_ID,
      universityName: UNIVERSITY_NAME,
      description: 'وجبات شرقية أصيلة ومنزلية - Authentic oriental and homemade meals',
      imageUrl: '',
      rating: 4.2,
      reviewCount: 38,
      categories: ['Main Dishes', 'Rice', 'Grilled'],
      isOpen: true,
      isApproved: true,
      isSuspended: false
    }
  ],

  // Demo orders
  orders: [
    {
      id: 'demo-order-1',
      userId: 'demo-student-1',
      vendorId: 'demo-vendor-1',
      items: [
        {
          id: 'espresso',
          name: 'Espresso',
          price: 15,
          quantity: 2,
          note: 'Extra hot',
          customizations: { 'Extra Shot': 5 },
          category: 'Coffee'
        }
      ],
      total: 40.0,
      status: 'completed',
      paymentMethod: 'wallet',
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      completedAt: new Date(Date.now() - 1800000).toISOString() // 30 min ago
    },
    {
      id: 'demo-order-2',
      userId: 'demo-student-2',
      vendorId: 'demo-vendor-2',
      items: [
        {
          id: 'chicken-rice',
          name: 'Chicken with Rice',
          price: 45,
          quantity: 1,
          note: 'Less spicy',
          customizations: {},
          category: 'Main Dishes'
        }
      ],
      total: 45.0,
      status: 'preparing',
      paymentMethod: 'wallet',
      createdAt: new Date(Date.now() - 900000).toISOString() // 15 min ago
    }
  ],

  // Demo notifications
  notifications: [
    {
      id: 'demo-notification-1',
      userId: 'demo-student-1',
      title: 'Order Completed',
      body: 'Your order from University Café is ready for pickup!',
      type: 'order_completed',
      status: 'sent',
      data: { orderId: 'demo-order-1' },
      createdAt: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: 'demo-notification-2',
      userId: 'demo-student-2',
      title: 'Order In Progress',
      body: 'Your order from Students Restaurant is being prepared.',
      type: 'order_update',
      status: 'sent',
      data: { orderId: 'demo-order-2' },
      createdAt: new Date(Date.now() - 900000).toISOString()
    }
  ],

  // Demo transactions
  transactions: [
    {
      id: 'demo-transaction-1',
      userId: 'demo-student-1',
      type: 'payment',
      amount: -40.0,
      description: 'Payment for order #demo-order-1',
      status: 'completed',
      orderId: 'demo-order-1',
      paymentMethod: 'wallet',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      completedAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'demo-transaction-2',
      userId: 'demo-student-1', 
      type: 'topup',
      amount: 100.0,
      description: 'Wallet top-up',
      status: 'completed',
      paymentMethod: 'credit_card',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      completedAt: new Date(Date.now() - 7200000).toISOString()
    }
  ],

  // Demo reviews
  reviews: [
    {
      id: 'demo-review-1',
      userId: 'demo-student-1',
      vendorId: 'demo-vendor-1',
      orderId: 'demo-order-1',
      rating: 5,
      comment: 'Excellent coffee and quick service!',
      isPublic: true,
      createdAt: new Date(Date.now() - 1200000).toISOString()
    }
  ],

  // Demo complaints
  complaints: [
    {
      id: 'demo-complaint-1',
      userId: 'demo-student-2',
      vendorId: 'demo-vendor-2',
      orderId: 'demo-order-2',
      title: 'Order taking too long',
      description: 'My order has been in preparation for over 20 minutes.',
      status: 'pending',
      priority: 'medium',
      createdAt: new Date(Date.now() - 300000).toISOString()
    }
  ],

  // Demo one-time codes
  oneTimeCodes: [
    {
      id: 'VND12345',
      code: 'VND12345',
      type: 'vendor',
      universityId: UNIVERSITY_ID,
      universityName: UNIVERSITY_NAME,
      createdBy: 'super-admin',
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      expiresAt: new Date(Date.now() + 518400000).toISOString(), // 6 days from now
      isActive: true,
      maxUses: 1,
      usageCount: 0,
      metadata: {
        createdByName: 'Super Admin',
        notes: 'Demo vendor registration code'
      }
    }
  ]
};

// Helper functions
async function createDemoData() {
  console.log('🚀 Starting Appwrite demo data setup...');
  
  try {
    // 1. Create university
    console.log('📚 Creating university...');
    try {
      await databases.createDocument(
        config.databaseId,
        config.collections.universities,
        demoData.university.id,
        demoData.university
      );
      console.log('✅ University created successfully');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️ University already exists, skipping...');
      } else {
        throw error;
      }
    }

    // 2. Create users
    console.log('👥 Creating users...');
    for (const user of demoData.users) {
      try {
        await databases.createDocument(
          config.databaseId,
          config.collections.users,
          user.id,
          user
        );
        console.log(`✅ User created: ${user.fullName}`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`ℹ️ User ${user.fullName} already exists, skipping...`);
        } else {
          console.error(`❌ Error creating user ${user.fullName}:`, error.message);
        }
      }
    }

    // 3. Create vendors
    console.log('🏪 Creating vendors...');
    for (const vendor of demoData.vendors) {
      try {
        await databases.createDocument(
          config.databaseId,
          config.collections.vendors,
          vendor.id,
          vendor
        );
        console.log(`✅ Vendor created: ${vendor.name}`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`ℹ️ Vendor ${vendor.name} already exists, skipping...`);
        } else {
          console.error(`❌ Error creating vendor ${vendor.name}:`, error.message);
        }
      }
    }

    // 4. Create orders
    console.log('📦 Creating orders...');
    for (const order of demoData.orders) {
      try {
        await databases.createDocument(
          config.databaseId,
          config.collections.orders,
          order.id,
          order
        );
        console.log(`✅ Order created: ${order.id}`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`ℹ️ Order ${order.id} already exists, skipping...`);
        } else {
          console.error(`❌ Error creating order ${order.id}:`, error.message);
        }
      }
    }

    // 5. Create notifications
    console.log('🔔 Creating notifications...');
    for (const notification of demoData.notifications) {
      try {
        await databases.createDocument(
          config.databaseId,
          config.collections.notifications,
          notification.id,
          notification
        );
        console.log(`✅ Notification created: ${notification.id}`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`ℹ️ Notification ${notification.id} already exists, skipping...`);
        } else {
          console.error(`❌ Error creating notification ${notification.id}:`, error.message);
        }
      }
    }

    // 6. Create transactions
    console.log('💰 Creating transactions...');
    for (const transaction of demoData.transactions) {
      try {
        await databases.createDocument(
          config.databaseId,
          config.collections.transactions,
          transaction.id,
          transaction
        );
        console.log(`✅ Transaction created: ${transaction.id}`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`ℹ️ Transaction ${transaction.id} already exists, skipping...`);
        } else {
          console.error(`❌ Error creating transaction ${transaction.id}:`, error.message);
        }
      }
    }

    // 7. Create reviews
    console.log('⭐ Creating reviews...');
    for (const review of demoData.reviews) {
      try {
        await databases.createDocument(
          config.databaseId,
          config.collections.reviews,
          review.id,
          review
        );
        console.log(`✅ Review created: ${review.id}`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`ℹ️ Review ${review.id} already exists, skipping...`);
        } else {
          console.error(`❌ Error creating review ${review.id}:`, error.message);
        }
      }
    }

    // 8. Create complaints
    console.log('📋 Creating complaints...');
    for (const complaint of demoData.complaints) {
      try {
        await databases.createDocument(
          config.databaseId,
          config.collections.complaints,
          complaint.id,
          complaint
        );
        console.log(`✅ Complaint created: ${complaint.id}`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`ℹ️ Complaint ${complaint.id} already exists, skipping...`);
        } else {
          console.error(`❌ Error creating complaint ${complaint.id}:`, error.message);
        }
      }
    }

    // 9. Create one-time codes
    console.log('🔑 Creating one-time codes...');
    for (const code of demoData.oneTimeCodes) {
      try {
        await databases.createDocument(
          config.databaseId,
          config.collections.oneTimeCodes,
          code.id,
          code
        );
        console.log(`✅ One-time code created: ${code.code}`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`ℹ️ One-time code ${code.code} already exists, skipping...`);
        } else {
          console.error(`❌ Error creating one-time code ${code.code}:`, error.message);
        }
      }
    }

    console.log('\n🎉 Demo data setup completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- University: 1`);
    console.log(`- Users: ${demoData.users.length}`);
    console.log(`- Vendors: ${demoData.vendors.length}`);
    console.log(`- Orders: ${demoData.orders.length}`);
    console.log(`- Notifications: ${demoData.notifications.length}`);
    console.log(`- Transactions: ${demoData.transactions.length}`);
    console.log(`- Reviews: ${demoData.reviews.length}`);
    console.log(`- Complaints: ${demoData.complaints.length}`);
    console.log(`- One-time codes: ${demoData.oneTimeCodes.length}`);

    console.log('\n📧 Demo accounts created:');
    console.log('Student: ahmed.hassan@students.eui.edu.eg');
    console.log('Student: sara.mohamed@students.eui.edu.eg');
    console.log('Vendor: vendor.cafe@students.eui.edu.eg');
    console.log('Admin: admin@students.eui.edu.eg');

  } catch (error) {
    console.error('❌ Error setting up demo data:', error);
    process.exit(1);
  }
}

async function cleanDemoData() {
  console.log('🧹 Cleaning demo data...');
  
  const collections = [
    'reviews', 'complaints', 'transactions', 'notifications', 
    'orders', 'vendors', 'users', 'oneTimeCodes'
  ];

  for (const collectionName of collections) {
    console.log(`🗑️ Cleaning ${collectionName}...`);
    
    // Get all demo documents (those starting with 'demo-')
    try {
      const documents = await databases.listDocuments(
        config.databaseId,
        config.collections[collectionName]
      );
      
      for (const doc of documents.documents) {
        if (doc.$id.startsWith('demo-') || doc.$id === UNIVERSITY_ID) {
          try {
            await databases.deleteDocument(
              config.databaseId,
              config.collections[collectionName],
              doc.$id
            );
            console.log(`✅ Deleted: ${doc.$id}`);
          } catch (error) {
            console.error(`❌ Error deleting ${doc.$id}:`, error.message);
          }
        }
      }
    } catch (error) {
      console.error(`❌ Error listing documents in ${collectionName}:`, error.message);
    }
  }
  
  console.log('🎉 Demo data cleanup completed!');
}

// Main execution
async function main() {
  const command = process.argv[2];
  
  if (!config.projectId) {
    console.error('❌ Error: NEXT_PUBLIC_APPWRITE_PROJECT_ID environment variable not set');
    process.exit(1);
  }
  
  if (!config.apiKey) {
    console.error('❌ Error: APPWRITE_API_KEY environment variable not set');
    console.log('💡 Tip: Generate a Server API key in your Appwrite console with the following scopes:');
    console.log('   - databases.read, databases.write');
    console.log('   - documents.read, documents.write');
    process.exit(1);
  }

  switch (command) {
    case 'setup':
    case undefined:
      await createDemoData();
      break;
    case 'clean':
      await cleanDemoData();
      break;
    case 'reset':
      await cleanDemoData();
      await createDemoData();
      break;
    default:
      console.log('Usage: node setup_demo_data_appwrite.js [setup|clean|reset]');
      console.log('  setup (default): Create demo data');
      console.log('  clean: Remove all demo data');
      console.log('  reset: Clean and then setup demo data');
      process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createDemoData, cleanDemoData };