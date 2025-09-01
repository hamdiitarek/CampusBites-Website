#!/usr/bin/env node

/**
 * Test Account Creation Script for CampusBites
 * 
 * This script creates test accounts for different user roles to facilitate
 * authentication testing during development.
 * 
 * Usage:
 *   node scripts/createTestAccounts.js
 *   node scripts/createTestAccounts.js --role student
 *   node scripts/createTestAccounts.js --role vendor  
 *   node scripts/createTestAccounts.js --role admin
 *   node scripts/createTestAccounts.js --role super-admin
 *   node scripts/createTestAccounts.js --clean
 * 
 * Environment Variables Required:
 *   NEXT_PUBLIC_APPWRITE_ENDPOINT
 *   NEXT_PUBLIC_APPWRITE_PROJECT_ID
 *   NEXT_PUBLIC_APPWRITE_DATABASE_ID
 *   APPWRITE_API_KEY (Server API Key with account.write permissions)
 */

import { Client, Account, Databases, Users, ID } from 'node-appwrite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Appwrite configuration
const config = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main',
  apiKey: process.env.APPWRITE_API_KEY,
  collections: {
    users: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || 'users',
    universities: process.env.NEXT_PUBLIC_APPWRITE_UNIVERSITIES_COLLECTION_ID || 'universities'
  }
};

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setKey(config.apiKey);

const users = new Users(client);
const databases = new Databases(client);

// Test account data
const testAccounts = {
  student: [
    {
      name: "Ahmed Hassan",
      email: "ahmed.student@test.campusbites.com",
      password: "TestStudent123!",
      role: "student",
      universityId: "egypt-university-informatics",
      universityName: "Egypt University of Informatics",
      phoneNumber: "+201234567890",
      walletBalance: 100
    },
    {
      name: "Fatma Ali",
      email: "fatma.student@test.campusbites.com", 
      password: "TestStudent123!",
      role: "student",
      universityId: "egypt-university-informatics",
      universityName: "Egypt University of Informatics",
      phoneNumber: "+201234567891",
      walletBalance: 50
    },
    {
      name: "Omar Mahmoud",
      email: "omar.student@test.campusbites.com",
      password: "TestStudent123!",
      role: "student", 
      universityId: "egypt-university-informatics",
      universityName: "Egypt University of Informatics",
      phoneNumber: "+201234567892",
      walletBalance: 75
    }
  ],
  vendor: [
    {
      name: "Mohamed Café Owner",
      email: "mohamed.vendor@test.campusbites.com",
      password: "TestVendor123!",
      role: "vendor",
      universityId: "egypt-university-informatics",
      universityName: "Egypt University of Informatics",
      phoneNumber: "+201234567893",
      walletBalance: 0
    },
    {
      name: "Sarah Restaurant Manager",
      email: "sarah.vendor@test.campusbites.com",
      password: "TestVendor123!",
      role: "vendor",
      universityId: "egypt-university-informatics",
      universityName: "Egypt University of Informatics", 
      phoneNumber: "+201234567894",
      walletBalance: 0
    }
  ],
  admin: [
    {
      name: "Khalid University Admin",
      email: "khalid.admin@test.campusbites.com",
      password: "TestAdmin123!",
      role: "admin",
      universityId: "egypt-university-informatics",
      universityName: "Egypt University of Informatics",
      phoneNumber: "+201234567895",
      walletBalance: 0
    }
  ],
  'super-admin': [
    {
      name: "Hamdi Super Admin",
      email: "hamdi.superadmin@test.campusbites.com",
      password: "TestSuperAdmin123!",
      role: "super-admin",
      universityId: "egypt-university-informatics",
      universityName: "Egypt University of Informatics",
      phoneNumber: "+201234567896",
      walletBalance: 0
    }
  ]
};

// Utility functions
function validateConfig() {
  if (!config.projectId) {
    throw new Error('NEXT_PUBLIC_APPWRITE_PROJECT_ID is required');
  }
  if (!config.apiKey) {
    throw new Error('APPWRITE_API_KEY is required');
  }
  console.log('✅ Configuration validated');
}

async function createAppwriteUser(userData) {
  try {
    // Create user account
    const user = await users.create(
      ID.unique(),
      userData.email,
      undefined, // phone
      userData.password,
      userData.name
    );

    console.log(`✅ Created Appwrite user: ${userData.email} (ID: ${user.$id})`);

    // Create user document in database
    await databases.createDocument(
      config.databaseId,
      config.collections.users,
      user.$id,
      {
        id: user.$id, // Required field
        fullName: userData.name,
        email: userData.email,
        universityId: userData.universityId,
        universityName: userData.universityName || 'Egypt University of Informatics',
        phoneNumber: userData.phoneNumber,
        isEmailVerified: false,
        role: userData.role,
        walletBalance: userData.walletBalance,
        fcmToken: userData.fcmToken || ''
        // Note: Omitting profileImageUrl since it's optional and requires valid URL format
      }
    );

    console.log(`✅ Created user document for: ${userData.email}`);
    return user;

  } catch (error) {
    if (error.code === 409) {
      console.log(`⚠️  User already exists: ${userData.email}`);
      return null;
    }
    throw error;
  }
}

async function deleteTestAccounts() {
  console.log('🧹 Cleaning up existing test accounts...');
  
  try {
    // Get all users
    const response = await users.list();
    const testUsers = response.users.filter(user => 
      user.email && user.email.includes('@test.campusbites.com')
    );

    for (const user of testUsers) {
      try {
        // Delete user document from database
        await databases.deleteDocument(
          config.databaseId,
          config.collections.users,
          user.$id
        );
        console.log(`🗑️  Deleted user document: ${user.email}`);
      } catch (error) {
        console.log(`⚠️  Could not delete user document for ${user.email}:`, error.message);
      }

      try {
        // Delete user account
        await users.delete(user.$id);
        console.log(`🗑️  Deleted user account: ${user.email}`);
      } catch (error) {
        console.log(`⚠️  Could not delete user account for ${user.email}:`, error.message);
      }
    }

    console.log(`✅ Cleanup completed. ${testUsers.length} test accounts processed.`);
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
  }
}

async function createAccountsByRole(role) {
  const accounts = testAccounts[role];
  if (!accounts) {
    console.error(`❌ Invalid role: ${role}`);
    console.log('Available roles:', Object.keys(testAccounts).join(', '));
    return;
  }

  console.log(`🚀 Creating ${accounts.length} ${role} test account(s)...`);
  
  let created = 0;
  for (const userData of accounts) {
    try {
      const user = await createAppwriteUser(userData);
      if (user) created++;
    } catch (error) {
      console.error(`❌ Failed to create ${userData.email}:`, error.message);
    }
  }

  console.log(`✅ Successfully created ${created} ${role} account(s)`);
}

async function createAllAccounts() {
  console.log('🚀 Creating all test accounts...');
  
  let totalCreated = 0;
  for (const [role, accounts] of Object.entries(testAccounts)) {
    console.log(`\n📝 Creating ${role} accounts...`);
    let created = 0;
    
    for (const userData of accounts) {
      try {
        const user = await createAppwriteUser(userData);
        if (user) created++;
      } catch (error) {
        console.error(`❌ Failed to create ${userData.email}:`, error.message);
      }
    }
    
    console.log(`✅ Created ${created}/${accounts.length} ${role} account(s)`);
    totalCreated += created;
  }

  console.log(`\n🎉 Account creation completed! Total: ${totalCreated} accounts created.`);
}

function printAccountInfo() {
  console.log('\n📋 Test Account Information:');
  console.log('=' .repeat(60));
  
  for (const [role, accounts] of Object.entries(testAccounts)) {
    console.log(`\n${role.toUpperCase()} ACCOUNTS:`);
    console.log('-'.repeat(30));
    
    accounts.forEach((account, index) => {
      console.log(`${index + 1}. ${account.name}`);
      console.log(`   Email: ${account.email}`);
      console.log(`   Password: ${account.password}`);
      console.log(`   Role: ${account.role}`);
      console.log(`   University: ${account.universityId}`);
      console.log(`   Phone: ${account.phoneNumber}`);
      console.log(`   Wallet: $${account.walletBalance}`);
      console.log('');
    });
  }
  
  console.log('=' .repeat(60));
  console.log('💡 Login URLs:');
  console.log('   English: http://localhost:3000/en/login');
  console.log('   Arabic:  http://localhost:3000/ar/login');
  console.log('');
}

async function main() {
  try {
    console.log('🧪 CampusBites Test Account Creation Script');
    console.log('==========================================\n');

    validateConfig();

    const args = process.argv.slice(2);
    const command = args[0];

    if (command === '--clean') {
      await deleteTestAccounts();
      return;
    }

    if (command === '--role') {
      const role = args[1];
      if (!role) {
        console.error('❌ Please specify a role after --role');
        console.log('Available roles:', Object.keys(testAccounts).join(', '));
        return;
      }
      await createAccountsByRole(role);
      return;
    }

    if (command === '--info' || command === '--list') {
      printAccountInfo();
      return;
    }

    if (command === '--help' || command === '-h') {
      console.log('Usage:');
      console.log('  node scripts/createTestAccounts.js                 # Create all test accounts');
      console.log('  node scripts/createTestAccounts.js --role student  # Create student accounts only');
      console.log('  node scripts/createTestAccounts.js --role vendor   # Create vendor accounts only');
      console.log('  node scripts/createTestAccounts.js --role admin    # Create admin accounts only');
      console.log('  node scripts/createTestAccounts.js --clean         # Delete all test accounts');
      console.log('  node scripts/createTestAccounts.js --info          # Show account information');
      console.log('  node scripts/createTestAccounts.js --help          # Show this help');
      console.log('');
      console.log('Available roles:', Object.keys(testAccounts).join(', '));
      return;
    }

    if (command && !command.startsWith('--')) {
      console.error(`❌ Unknown command: ${command}`);
      console.log('Use --help to see available commands');
      return;
    }

    // Default: create all accounts
    await createAllAccounts();
    console.log('\n📋 Use --info to see login credentials');

  } catch (error) {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
