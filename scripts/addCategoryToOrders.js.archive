#!/usr/bin/env node

/**
 * Database Migration Script: Add Category Information to Order Items
 * 
 * This script migrates existing orders in the Firestore database to include
 * category information for each order item by looking up the menu data.
 * 
 * Enhanced fields added to order items:
 * - category: The food category from the vendor's menu
 * 
 * Usage: node scripts/addCategoryToOrders.js [migrate|rollback|dry-run]
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
 * Get menu item category from vendor's menu structure
 * Uses the proper database schema: vendors/{vendorId}/menu collection
 */
async function getItemCategory(vendorId, itemId, itemName) {
  try {
    // Get menu document from vendor's menu subcollection
    const menuSnapshot = await db.collection('vendors').doc(vendorId).collection('menu').get();
    
    if (menuSnapshot.empty) {
      console.log(`⚠️  No menu found for vendor ${vendorId}`);
      return 'Other';
    }

    // Search through menu documents
    for (const menuDoc of menuSnapshot.docs) {
      const menuData = menuDoc.data();
      
      // Search through all categories in the menu document
      for (const [categoryKey, categoryData] of Object.entries(menuData)) {
        if (categoryData && typeof categoryData === 'object' && categoryData.Name) {
          // This is a category object with Name and CID
          const categoryName = categoryData.Name;
          
          // Search within category items
          for (const [itemKey, itemData] of Object.entries(categoryData)) {
            if (itemKey !== 'Name' && itemKey !== 'CID' && itemData && typeof itemData === 'object') {
              // Match by item ID (key) or item name
              if (itemKey === itemId || itemData.Name === itemName) {
                // Return the Category field if exists, otherwise use category name
                return itemData.Category || categoryName;
              }
            }
          }
        }
      }
    }
    
    // If not found, return 'Other' as default
    console.log(`⚠️  Item ${itemName} (${itemId}) not found in vendor ${vendorId} menu`);
    return 'Other';
  } catch (error) {
    console.error(`❌ Error getting category for item ${itemId} from vendor ${vendorId}:`, error);
    return 'Other';
  }
}

/**
 * Main migration function
 */
async function migrateOrders() {
  console.log('🚀 Starting category migration for order items...');

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
      
      // Skip if order already has categories or no items
      if (!orderData.items || !Array.isArray(orderData.items)) {
        skippedCount++;
        console.log(`⏭️  Skipping order ${doc.id} - no items array`);
        continue;
      }

      const hasCategories = orderData.items.some(item => item.category);
      if (hasCategories) {
        skippedCount++;
        console.log(`⏭️  Skipping order ${doc.id} - already migrated`);
        continue;
      }

      // Process each item to add category
      const updatedItems = [];
      for (const item of orderData.items) {
        const category = await getItemCategory(orderData.vendorId, item.id, item.name);
        
        updatedItems.push({
          ...item,
          category: category
        });
      }

      // Prepare update data
      const updateData = {
        items: updatedItems,
        // Add migration metadata
        migratedAt: admin.firestore.FieldValue.serverTimestamp(),
        categoryMigrationVersion: '1.0'
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
        console.log(`📈 Progress: ${migratedCount} orders migrated...`);
      }
    }

    // Execute final batch
    if (operationCount > 0) {
      console.log(`🔄 Executing final batch of ${operationCount} operations...`);
      await batch.commit();
    }

    console.log('✅ Migration completed successfully!');
    console.log(`📊 Total orders: ${ordersSnapshot.size}`);
    console.log(`📈 Migrated: ${migratedCount}`);
    console.log(`⏭️  Skipped: ${skippedCount}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

/**
 * Rollback function (if needed)
 */
async function rollbackMigration() {
  console.log('� Starting rollback...');
  
  try {
    const ordersSnapshot = await db.collection('orders')
      .where('categoryMigrationVersion', '==', '1.0')
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
      const orderData = doc.data();
      
      // Remove categories from items
      const rollbackItems = orderData.items.map(item => {
        const { category, ...itemWithoutCategory } = item;
        return itemWithoutCategory;
      });

      // Remove migration fields
      batch.update(doc.ref, {
        items: rollbackItems,
        migratedAt: admin.firestore.FieldValue.delete(),
        categoryMigrationVersion: admin.firestore.FieldValue.delete()
      });

      operationCount++;

      if (operationCount >= batchSize) {
        console.log(`🔄 Executing rollback batch of ${operationCount} operations...`);
        await batch.commit();
        batch = db.batch();
        operationCount = 0;
      }
    }

    // Execute final batch
    if (operationCount > 0) {
      console.log(`� Executing final rollback batch of ${operationCount} operations...`);
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
      const ordersSnapshot = await db.collection('orders').limit(10).get();
      console.log(`📊 Sample of ${ordersSnapshot.size} orders:`);
      
      let withCategories = 0;
      let withoutCategories = 0;
      
      for (const doc of ordersSnapshot.docs) {
        const data = doc.data();
        const hasCategories = data.items && data.items.some(item => item.category);
        console.log(`Order ${doc.id}: ${data.items?.length || 0} items, categories: ${hasCategories ? 'YES' : 'NO'}`);
        
        if (hasCategories) {
          withCategories++;
        } else {
          withoutCategories++;
        }
      }
      
      console.log(`\n📈 Summary: ${withCategories} with categories, ${withoutCategories} need migration`);
      break;
    default:
      console.log('Usage: node addCategoryToOrders.js [migrate|rollback|dry-run]');
  }

  process.exit(0);
}

main().catch(console.error);
