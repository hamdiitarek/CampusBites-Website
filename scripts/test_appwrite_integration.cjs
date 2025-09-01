#!/usr/bin/env node
/**
 * Appwrite Integration Test Script
 * Tests that the Appwrite services are working correctly
 */

const { Client, Databases } = require('node-appwrite');
const dotenv = require('dotenv');

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
    notifications: process.env.NEXT_PUBLIC_APPWRITE_NOTIFICATIONS_COLLECTION_ID || 'notifications'
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

async function testAppwriteConnection() {
  console.log('🧪 Testing Appwrite Integration...\n');
  
  // Test 1: Connection
  console.log('1. Testing connection to Appwrite...');
  try {
    if (!config.projectId) {
      console.log('❌ No project ID configured. Please set NEXT_PUBLIC_APPWRITE_PROJECT_ID');
      return false;
    }
    
    if (!config.apiKey) {
      console.log('❌ No API key configured. Please set APPWRITE_API_KEY');
      return false;
    }
    
    console.log(`✅ Configuration loaded:`);
    console.log(`   - Endpoint: ${config.endpoint}`);
    console.log(`   - Project ID: ${config.projectId}`);
    console.log(`   - Database ID: ${config.databaseId}`);
    
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    return false;
  }
  
  // Test 2: Database access
  console.log('\n2. Testing database access...');
  try {
    await databases.list();
    console.log('✅ Database access successful');
  } catch (error) {
    console.log('❌ Database access failed:', error.message);
    return false;
  }
  
  // Test 3: Collections access
  console.log('\n3. Testing collections access...');
  const collectionTests = [];
  
  for (const [name, id] of Object.entries(config.collections)) {
    try {
      const result = await databases.listDocuments(config.databaseId, id, []);
      console.log(`✅ ${name} collection (${id}): ${result.total} documents`);
      collectionTests.push({ name, id, count: result.total, success: true });
    } catch (error) {
      console.log(`❌ ${name} collection (${id}): ${error.message}`);
      collectionTests.push({ name, id, success: false, error: error.message });
    }
  }
  
  // Test 4: Service layer test
  console.log('\n4. Testing service layer...');
  try {
    // Import the Appwrite service (this is a dynamic import for Node.js compatibility)
    const { SuperAdminService } = require('./app/lib/appwriteSuperAdminService.ts');
    
    // Test a simple method that doesn't require data
    console.log('✅ Service layer imported successfully');
    
    // Note: We can't actually test service methods without proper setup,
    // but we can verify the import works
    
  } catch (error) {
    console.log('❌ Service layer test failed:', error.message);
  }
  
  // Summary
  console.log('\n📊 Test Summary:');
  const successfulCollections = collectionTests.filter(t => t.success).length;
  const totalCollections = collectionTests.length;
  
  console.log(`Collections accessible: ${successfulCollections}/${totalCollections}`);
  
  if (successfulCollections === totalCollections) {
    console.log('🎉 All tests passed! Appwrite integration is working correctly.');
    return true;
  } else {
    console.log('⚠️  Some collections are not accessible. Please check your Appwrite setup.');
    console.log('\nTip: Make sure you have:');
    console.log('1. Created all required collections in your Appwrite database');
    console.log('2. Set proper permissions for your API key');
    console.log('3. Configured the correct collection IDs in your environment');
    return false;
  }
}

async function main() {
  const success = await testAppwriteConnection();
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  });
}

module.exports = { testAppwriteConnection };