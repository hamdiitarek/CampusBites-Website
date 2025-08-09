# Database Migration Scripts

This directory contains scripts to migrate your existing orders to enhanced schemas with proper timestamp tracking and category information.

## 🚀 Available Migrations

### 1. Enhanced Order Timestamps (`migrateOrderTimestamps.js`)
Adds timestamp tracking for better analytics and performance monitoring.

### 2. Category Information (`addCategoryToOrders.js`) 
Adds food categories to order items for proper analytics dashboard functionality.

## 📋 Quick Start

### Prerequisites
```bash
npm install firebase-admin
```

### Firebase Service Account Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** → **Service Accounts**  
4. Click **Generate New Private Key**
5. Save as `firebase-service-account.json` in project root

### Run Migrations
```bash
# Category migration (fixes dashboard analytics)
npm run migrate:categories

# Timestamp migration (for detailed analytics)
npm run migrate:orders
```

## 🎯 Migration Details

### Category Migration (`addCategoryToOrders.js`)
**Problem**: Dashboard Category Performance Breakdown shows empty/incorrect data because order items don't contain category information.

**Solution**: Looks up vendor menus and adds category field to all order items.

**Benefits**: 
- ✅ Category Performance Breakdown works correctly
- ✅ Revenue-based category percentages
- ✅ Future orders automatically include categories
- ✅ Historical data consistency

See `CATEGORY_MIGRATION_README.md` for detailed documentation.

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install firebase-admin
```

### 2. Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** → **Service Accounts**  
4. Click **Generate New Private Key**
5. Save the downloaded JSON file as `firebase-service-account.json` in your project root

### 3. Configure the Script

Update the `scripts/migrateOrderTimestamps.js` file:

```javascript
// Replace with your actual Firebase project ID
projectId: 'your-actual-firebase-project-id'
```

## 🛠️ Running the Migration

### Dry Run (Recommended First)
```bash
node scripts/migrateOrderTimestamps.js dry-run
```

### Full Migration
```bash
node scripts/migrateOrderTimestamps.js migrate
```

### Rollback (If Needed)
```bash
node scripts/migrateOrderTimestamps.js rollback
```

## 📊 Migration Logic

The script generates realistic timestamps based on order status:

### For **Completed Orders**:
- `confirmedAt`: 5-25 minutes after creation
- `readyAt`: 10-40 minutes after confirmation  
- `completedAt`: 2-12 minutes after ready

### For **Cancelled Orders**:
- `cancelledAt`: Random time during order lifecycle
- May include `confirmedAt` if cancelled after confirmation

### For **Ready Orders**:
- `confirmedAt`: 5-25 minutes after creation
- `readyAt`: 10-40 minutes after confirmation

### For **Confirmed Orders**:
- `confirmedAt`: 5-25 minutes after creation

## 🔒 Safety Features

- **Batch Processing**: Processes orders in batches to avoid timeouts
- **Skip Existing**: Won't re-migrate already migrated orders
- **Rollback Support**: Can undo migration if needed
- **Progress Logging**: Shows migration progress in real-time
- **Schema Versioning**: Tracks migration version for safety

## 📈 After Migration

Once migrated, your analytics dashboard will show:

- **Accurate Response Times**: Real vendor confirmation times
- **Preparation Analytics**: Time from confirmation to ready
- **Complete Order Timeline**: Full audit trail of order progression

## 🎉 Benefits

### Before Migration:
```
Order: createdAt only → Estimated 0min response times
```

### After Migration:
```
Order: createdAt → confirmedAt → readyAt → completedAt
Real metrics: 15min response, 25min prep time
```

## ⚠️ Important Notes

1. **Backup First**: Always backup your database before running migrations
2. **Test Environment**: Run on staging/test environment first
3. **Off-Peak Hours**: Run during low traffic periods
4. **Monitor**: Watch for any errors during migration
5. **Verification**: Verify a few migrated orders manually

## 🔧 Troubleshooting

### Permission Issues
Ensure your service account has these roles:
- Cloud Datastore User
- Firebase Admin SDK Administrator Service Agent

### Large Dataset
For databases with >10,000 orders:
- Consider running during off-peak hours
- Monitor Firestore quotas and usage
- The script automatically batches operations for efficiency

### Migration Verification
After migration, check a few orders manually:

```javascript
// In Firestore console, verify an order has:
{
  "createdAt": "2024-01-01T10:00:00Z",
  "confirmedAt": "2024-01-01T10:15:00Z",
  "readyAt": "2024-01-01T10:35:00Z", 
  "completedAt": "2024-01-01T10:45:00Z",
  "statusHistory": [...],
  "schemaVersion": "2.0"
}
```

## 📞 Support

If you encounter issues:

1. Check the error logs carefully
2. Verify Firebase permissions
3. Ensure service account file is correct
4. Try the dry-run mode first

Happy migrating! 🎉
