#!/usr/bin/env node

/**
 * Database Migration Script: Add Enhanced Timestamp Fields to Orders
 * 
 * This script migrates existing orders in the Firestore database to include
 * the enhanced timestamp fields for better analytics and tracking.
 * 
 * Enhanced fields added:
 * - confirmedAt: Estimated timestamp when order was confirmed
 * - readyAt: Estimated timestamp when order was ready
 * - completedAt: Estimated timestamp when order was completed
 * - cancelledAt: Estimated timestamp when order was cancelled (if applicable)
 * - statusHistory: Array tracking all status changes
 * 
 * Usage: node scripts/migrateOrderTimestamps.js
 */

import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin SDK
let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(join(__dirname, '../firebase-service-account.json'), 'utf8'));
} catch (error) {
  console.error('❌ Error reading firebase-service-account.json:');
  console.error('Please ensure firebase-service-account.json exists in your project root');
  console.error('See scripts/README.md for setup instructions');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id
});

const db = admin.firestore();

/**
 * Generate realistic timestamp based on order status and creation time
 */
function generateTimestamps(createdAt, status) {
  const created = createdAt.toDate();
  const timestamps = {
    createdAt: createdAt // Keep original
  };

  // Generate realistic time intervals (in minutes)
  const confirmationTime = Math.floor(Math.random() * 20) + 5; // 5-25 minutes
  const preparationTime = Math.floor(Math.random() * 30) + 10; // 10-40 minutes
  const completionBuffer = Math.floor(Math.random() * 10) + 2; // 2-12 minutes

  // Calculate timestamps based on status
  switch (status) {
    case 'confirmed':
      timestamps.confirmedAt = admin.firestore.Timestamp.fromDate(
        new Date(created.getTime() + confirmationTime * 60 * 1000)
      );
      break;

    case 'ready':
      timestamps.confirmedAt = admin.firestore.Timestamp.fromDate(
        new Date(created.getTime() + confirmationTime * 60 * 1000)
      );
      timestamps.readyAt = admin.firestore.Timestamp.fromDate(
        new Date(created.getTime() + (confirmationTime + preparationTime) * 60 * 1000)
      );
      break;

    case 'completed':
      timestamps.confirmedAt = admin.firestore.Timestamp.fromDate(
        new Date(created.getTime() + confirmationTime * 60 * 1000)
      );
      timestamps.readyAt = admin.firestore.Timestamp.fromDate(
        new Date(created.getTime() + (confirmationTime + preparationTime) * 60 * 1000)
      );
      timestamps.completedAt = admin.firestore.Timestamp.fromDate(
        new Date(created.getTime() + (confirmationTime + preparationTime + completionBuffer) * 60 * 1000)
      );
      break;

    case 'cancelled':
      // Cancelled orders might be cancelled at any stage
      const cancellationTime = Math.floor(Math.random() * (confirmationTime + preparationTime)) + 2;
      timestamps.cancelledAt = admin.firestore.Timestamp.fromDate(
        new Date(created.getTime() + cancellationTime * 60 * 1000)
      );
      
      // If cancelled after confirmation, add confirmedAt
      if (cancellationTime > confirmationTime) {
        timestamps.confirmedAt = admin.firestore.Timestamp.fromDate(
          new Date(created.getTime() + confirmationTime * 60 * 1000)
        );
      }
      break;

    case 'pending':
    default:
      // Pending orders only have createdAt
      break;
  }

  return timestamps;
}

/**
 * Generate status history based on timestamps
 */
function generateStatusHistory(timestamps, finalStatus, vendorId, userId) {
  const history = [];

  // Always start with pending
  history.push({
    status: 'pending',
    timestamp: timestamps.createdAt,
    updatedBy: userId,
    note: 'Order created'
  });

  // Add confirmed if exists
  if (timestamps.confirmedAt) {
    history.push({
      status: 'confirmed',
      timestamp: timestamps.confirmedAt,
      updatedBy: vendorId,
      note: 'Order confirmed by vendor'
    });
  }

  // Add ready if exists
  if (timestamps.readyAt) {
    history.push({
      status: 'ready',
      timestamp: timestamps.readyAt,
      updatedBy: vendorId,
      note: 'Order ready for pickup'
    });
  }

  // Add final status
  if (timestamps.completedAt) {
    history.push({
      status: 'completed',
      timestamp: timestamps.completedAt,
      updatedBy: vendorId,
      note: 'Order completed'
    });
  } else if (timestamps.cancelledAt) {
    history.push({
      status: 'cancelled',
      timestamp: timestamps.cancelledAt,
      updatedBy: vendorId, // Could be vendor or user
      note: 'Order cancelled'
    });
  }

  return history;
}

/**
 * Main migration function
 */
async function migrateOrders() {
  console.log('🚀 Starting order timestamp migration...');
  
  try {
    // Get all orders
    const ordersSnapshot = await db.collection('orders').get();
    console.log(`📊 Found ${ordersSnapshot.size} orders to migrate`);

    if (ordersSnapshot.empty) {
      console.log('✅ No orders found. Migration complete.');
      return;
    }

    let migratedCount = 0;
    let skippedCount = 0;
    const batchSize = 500; // Firestore batch limit
    let batch = db.batch();
    let operationCount = 0;

    for (const doc of ordersSnapshot.docs) {
      const orderData = doc.data();
      
      // Skip if order already has enhanced timestamps
      if (orderData.confirmedAt || orderData.statusHistory) {
        skippedCount++;
        console.log(`⏭️  Skipping order ${doc.id} - already migrated`);
        continue;
      }

      // Generate enhanced timestamps
      const timestamps = generateTimestamps(orderData.createdAt, orderData.status);
      const statusHistory = generateStatusHistory(
        timestamps, 
        orderData.status, 
        orderData.vendorId, 
        orderData.userId
      );

      // Prepare update data
      const updateData = {
        ...timestamps,
        statusHistory: statusHistory,
        // Add migration metadata
        migratedAt: admin.firestore.FieldValue.serverTimestamp(),
        schemaVersion: '2.0'
      };

      // Add to batch
      batch.update(doc.ref, updateData);
      operationCount++;
      migratedCount++;

      // Execute batch when it reaches the limit
      if (operationCount >= batchSize) {
        console.log(`🔄 Executing batch of ${operationCount} operations...`);
        await batch.commit();
        batch = db.batch();
        operationCount = 0;
      }

      // Log progress
      if (migratedCount % 100 === 0) {
        console.log(`📈 Migrated ${migratedCount} orders...`);
      }
    }

    // Execute remaining operations
    if (operationCount > 0) {
      console.log(`🔄 Executing final batch of ${operationCount} operations...`);
      await batch.commit();
    }

    console.log('✅ Migration completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Total orders: ${ordersSnapshot.size}`);
    console.log(`   - Migrated: ${migratedCount}`);
    console.log(`   - Skipped: ${skippedCount}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

/**
 * Rollback function (if needed)
 */
async function rollbackMigration() {
  console.log('🔄 Starting rollback...');
  
  try {
    const ordersSnapshot = await db.collection('orders')
      .where('schemaVersion', '==', '2.0')
      .get();
    
    console.log(`📊 Found ${ordersSnapshot.size} orders to rollback`);

    if (ordersSnapshot.empty) {
      console.log('✅ No migrated orders found. Rollback complete.');
      return;
    }

    let batch = db.batch();
    let operationCount = 0;
    const batchSize = 500;

    for (const doc of ordersSnapshot.docs) {
      // Remove enhanced fields
      batch.update(doc.ref, {
        confirmedAt: admin.firestore.FieldValue.delete(),
        readyAt: admin.firestore.FieldValue.delete(),
        completedAt: admin.firestore.FieldValue.delete(),
        cancelledAt: admin.firestore.FieldValue.delete(),
        statusHistory: admin.firestore.FieldValue.delete(),
        migratedAt: admin.firestore.FieldValue.delete(),
        schemaVersion: admin.firestore.FieldValue.delete()
      });

      operationCount++;

      if (operationCount >= batchSize) {
        await batch.commit();
        batch = db.batch();
        operationCount = 0;
      }
    }

    if (operationCount > 0) {
      await batch.commit();
    }

    console.log('✅ Rollback completed successfully!');

  } catch (error) {
    console.error('❌ Rollback failed:', error);
    process.exit(1);
  }
}

// Main execution
async function main() {
  const command = process.argv[2] || 'migrate';

  switch (command) {
    case 'migrate':
      await migrateOrders();
      break;
    case 'rollback':
      await rollbackMigration();
      break;
    case 'dry-run':
      console.log('🔍 Performing dry run...');
      // Add dry run logic here
      const ordersSnapshot = await db.collection('orders').limit(10).get();
      console.log(`📊 Sample of ${ordersSnapshot.size} orders:`);
      ordersSnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`Order ${doc.id}: status=${data.status}, created=${data.createdAt.toDate()}`);
      });
      break;
    default:
      console.log('Usage: node migrateOrderTimestamps.js [migrate|rollback|dry-run]');
  }

  process.exit(0);
}

main().catch(console.error);
