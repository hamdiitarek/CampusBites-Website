// Script to clean up orders with empty or undefined IDs
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore';

// Firebase configuration  
const firebaseConfig = {
  apiKey: "AIzaSyBxtC8pV9alKYNITJ4j13Iy3ZI-_j8XS_M",
  authDomain: "campusbites-eg.firebaseapp.com",
  projectId: "campusbites-eg",
  storageBucket: "campusbites-eg.firebasestorage.app",
  messagingSenderId: "970089094387",
  appId: "1:970089094387:web:9a7a6dea9f163ae5a12b86",
  measurementId: "G-YHYJ77SP8M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function cleanupInvalidOrders() {
  console.log('🧹 CLEANING UP ORDERS WITH INVALID IDs');
  console.log('='.repeat(60));
  
  try {
    // Get all orders
    console.log('📦 Fetching all orders...');
    const ordersRef = collection(db, 'orders');
    const ordersSnapshot = await getDocs(ordersRef);
    
    console.log(`📊 Total orders found: ${ordersSnapshot.size}`);
    
    // Find orders with empty, undefined, or invalid IDs
    const invalidOrders = [];
    const validOrders = [];
    
    ordersSnapshot.docs.forEach(docSnapshot => {
      const docId = docSnapshot.id;
      const orderData = docSnapshot.data();
      
      // Check if document ID is empty, undefined, or suspicious
      if (!docId || docId.trim() === '' || docId === 'undefined' || docId === 'null') {
        invalidOrders.push({
          docId,
          data: orderData
        });
      } else {
        validOrders.push({
          docId,
          data: orderData
        });
      }
    });
    
    console.log(`✅ Valid orders: ${validOrders.length}`);
    console.log(`❌ Invalid orders: ${invalidOrders.length}`);
    
    if (invalidOrders.length === 0) {
      console.log('🎉 No invalid orders found! All orders have proper IDs.');
      return;
    }
    
    // Show details of invalid orders
    console.log('\n🔍 INVALID ORDERS DETAILS:');
    console.log('-'.repeat(40));
    
    invalidOrders.forEach((order, index) => {
      console.log(`${index + 1}. Document ID: "${order.docId}"`);
      console.log(`   Status: ${order.data.status || 'undefined'}`);
      console.log(`   Total: ${order.data.total || 'undefined'}`);
      console.log(`   Created: ${order.data.createdAt ? new Date(order.data.createdAt.seconds * 1000).toISOString() : 'undefined'}`);
      console.log(`   Vendor ID: ${order.data.vendorId || 'undefined'}`);
      console.log(`   User ID: ${order.data.userId || 'undefined'}`);
      console.log();
    });
    
    // Ask for confirmation (in production, you might want to add a --confirm flag)
    console.log('⚠️  WARNING: This will permanently delete these invalid orders!');
    console.log('⚠️  Make sure you have a backup before proceeding.');
    
    // For safety, let's add a dry-run mode first
    const isDryRun = process.argv.includes('--dry-run');
    const isConfirmed = process.argv.includes('--confirm');
    
    if (isDryRun) {
      console.log('\n🔍 DRY RUN MODE - No orders will be deleted');
      console.log(`Would delete ${invalidOrders.length} orders with invalid IDs`);
      return;
    }
    
    if (!isConfirmed) {
      console.log('\n❌ Operation cancelled. To proceed:');
      console.log('   - Dry run: node scripts/cleanup_invalid_orders.js --dry-run');
      console.log('   - Delete: node scripts/cleanup_invalid_orders.js --confirm');
      return;
    }
    
    // Proceed with deletion
    console.log('\n🗑️  DELETING INVALID ORDERS...');
    
    // Use batch operations for better performance
    const batch = writeBatch(db);
    let batchCount = 0;
    let totalDeleted = 0;
    
    for (const order of invalidOrders) {
      const orderRef = doc(db, 'orders', order.docId);
      batch.delete(orderRef);
      batchCount++;
      
      // Firestore batch limit is 500 operations
      if (batchCount >= 500) {
        await batch.commit();
        totalDeleted += batchCount;
        console.log(`   ✅ Deleted batch of ${batchCount} orders (Total: ${totalDeleted})`);
        batchCount = 0;
        // Create new batch for remaining operations
        const newBatch = writeBatch(db);
        Object.setPrototypeOf(batch, Object.getPrototypeOf(newBatch));
        Object.assign(batch, newBatch);
      }
    }
    
    // Commit remaining orders in batch
    if (batchCount > 0) {
      await batch.commit();
      totalDeleted += batchCount;
      console.log(`   ✅ Deleted final batch of ${batchCount} orders`);
    }
    
    console.log(`\n🎉 Successfully deleted ${totalDeleted} orders with invalid IDs!`);
    console.log(`📊 Remaining valid orders: ${validOrders.length}`);
    
    // Verify the cleanup
    console.log('\n🔍 Verifying cleanup...');
    const verifySnapshot = await getDocs(ordersRef);
    console.log(`📊 Orders after cleanup: ${verifySnapshot.size}`);
    
    if (verifySnapshot.size === validOrders.length) {
      console.log('✅ Cleanup verified successfully!');
    } else {
      console.log('⚠️  Warning: Order count mismatch after cleanup');
    }
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  }
}

// Additional function to analyze orders and identify potential issues
async function analyzeOrders() {
  console.log('🔍 ANALYZING ORDER DATA QUALITY');
  console.log('='.repeat(60));
  
  try {
    const ordersRef = collection(db, 'orders');
    const ordersSnapshot = await getDocs(ordersRef);
    
    const analysis = {
      total: ordersSnapshot.size,
      emptyIds: 0,
      shortIds: 0,
      duplicateIds: new Set(),
      missingFields: {
        status: 0,
        total: 0,
        userId: 0,
        vendorId: 0,
        createdAt: 0,
        items: 0
      }
    };
    
    const seenIds = new Set();
    
    ordersSnapshot.docs.forEach(docSnapshot => {
      const docId = docSnapshot.id;
      const data = docSnapshot.data();
      
      // Check ID issues
      if (!docId || docId.trim() === '') {
        analysis.emptyIds++;
      } else if (docId.length < 10) {
        analysis.shortIds++;
      }
      
      if (seenIds.has(docId)) {
        analysis.duplicateIds.add(docId);
      }
      seenIds.add(docId);
      
      // Check missing fields
      if (!data.status) analysis.missingFields.status++;
      if (!data.total && data.total !== 0) analysis.missingFields.total++;
      if (!data.userId) analysis.missingFields.userId++;
      if (!data.vendorId) analysis.missingFields.vendorId++;
      if (!data.createdAt) analysis.missingFields.createdAt++;
      if (!data.items || !Array.isArray(data.items)) analysis.missingFields.items++;
    });
    
    console.log('📊 ANALYSIS RESULTS:');
    console.log(`   Total orders: ${analysis.total}`);
    console.log(`   Orders with empty IDs: ${analysis.emptyIds}`);
    console.log(`   Orders with short IDs (< 10 chars): ${analysis.shortIds}`);
    console.log(`   Duplicate IDs: ${analysis.duplicateIds.size}`);
    
    if (analysis.duplicateIds.size > 0) {
      console.log(`   Duplicate ID list: ${Array.from(analysis.duplicateIds).join(', ')}`);
    }
    
    console.log('\n📋 MISSING FIELDS:');
    Object.entries(analysis.missingFields).forEach(([field, count]) => {
      if (count > 0) {
        console.log(`   ${field}: ${count} orders missing this field`);
      }
    });
    
    if (analysis.emptyIds === 0 && analysis.duplicateIds.size === 0) {
      console.log('\n✅ All orders have valid, unique IDs!');
    } else {
      console.log('\n⚠️  Issues found with order IDs. Run cleanup to fix.');
    }
    
  } catch (error) {
    console.error('❌ Error during analysis:', error);
    throw error;
  }
}

// Main execution
async function main() {
  const command = process.argv[2];
  
  try {
    if (command === 'analyze') {
      await analyzeOrders();
    } else {
      await cleanupInvalidOrders();
    }
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  } finally {
    console.log('\n✅ Script completed');
    process.exit(0);
  }
}

// Handle command line arguments
if (process.argv.length < 3) {
  console.log('📖 USAGE:');
  console.log('   Analyze orders: node scripts/cleanup_invalid_orders.js analyze');
  console.log('   Dry run cleanup: node scripts/cleanup_invalid_orders.js --dry-run');
  console.log('   Actual cleanup: node scripts/cleanup_invalid_orders.js --confirm');
  process.exit(1);
}

main().catch(console.error);
