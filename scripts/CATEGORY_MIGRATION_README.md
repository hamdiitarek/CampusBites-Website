# Database Migration: Add Category Information to Orders

This migration script adds category information to existing order items, enabling proper category-based analytics in the dashboard.

## 🚀 Setup Instructions

### 1. Prerequisites

Ensure you have:
- Firebase Admin SDK access
- `firebase-service-account.json` in your project root
- Node.js 18+ installed

### 2. Install Dependencies

```bash
npm install firebase-admin
```

### 3. Firebase Service Account Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`campus-bites-b6288`)
3. Go to **Project Settings** → **Service Accounts**  
4. Click **Generate New Private Key**
5. Save the downloaded JSON file as `firebase-service-account.json` in your project root

## 🛠️ Running the Migration

### Option 1: Using NPM Script (Recommended)
```bash
npm run migrate:categories
```

### Option 2: Direct Node Execution
```bash
node scripts/addCategoryToOrders.js
```

## 📊 What the Migration Does

### Fields Added to Order Items:
- `category`: The food category from the vendor's menu (e.g., "Fast Food", "Main Course", "Beverages")

### How it Works:
1. **Fetches all orders** from the Firestore `orders` collection
2. **Looks up vendor menus** to find category information for each order item
3. **Maps items to categories** using item ID and name matching
4. **Updates both collections**:
   - Main `orders` collection
   - Vendor-specific `vendors/{vendorId}/orders` subcollection
5. **Processes in batches** to avoid Firestore rate limits
6. **Skips already migrated orders** to allow safe re-runs

### Category Mapping Logic:
- Searches vendor menu structure for matching items
- Maps by item ID, name, or internal menu references
- Defaults to 'Other' if no category is found
- Preserves existing category information if already present

## 📋 Migration Output

The script provides detailed logging:
- ✅ **Success**: Orders successfully updated
- ⚠️ **Warnings**: Orders skipped (no items, already migrated)
- ❌ **Errors**: Issues with specific orders or menu lookups
- 📊 **Statistics**: Total processed, updated counts, verification results

Example output:
```bash
🚀 Starting migration: Add category information to order items...
📊 Found 847 total orders
🔄 Processing batch 1 (10 orders)...
✅ Updated 8 orders in this batch
⏳ Waiting 2 seconds before next batch...
🎉 Migration completed successfully!
📈 Total orders updated: 834
📋 Total orders processed: 847
🔍 Verifying migration results...
✅ Orders with categories: 10
❌ Orders without categories: 0
🎯 All sampled orders have category information!
```

## 🔄 Post-Migration Benefits

After running this migration:

1. **Dashboard Analytics Work**: Category Performance Breakdown shows real data
2. **Accurate Percentages**: Revenue-based category calculations
3. **Future Orders**: New orders automatically include category information
4. **Data Consistency**: Historical and new orders have the same data structure

## 🚨 Important Notes

### Migration Safety:
- ✅ **Safe to re-run**: Skips already migrated orders
- ✅ **Batch processing**: Prevents overwhelming Firestore
- ✅ **Error recovery**: Continues processing even if individual orders fail
- ✅ **Backup recommended**: Consider backing up your Firestore data first

### Data Validation:
- The script includes verification to check migration success
- Sample orders are checked for category presence
- Failed migrations are logged for manual review

### Performance Impact:
- Processes in batches of 10 orders
- 2-second delay between batches to respect Firestore limits
- Async category lookups for each vendor menu

## 🔍 Troubleshooting

### Common Issues:

**1. Firebase Service Account Error**
```bash
❌ Error reading firebase-service-account.json
```
**Solution**: Ensure the service account file exists in project root

**2. Permission Denied**
```bash
❌ Permission denied on Firestore operation
```
**Solution**: Check that your service account has Firestore Admin permissions

**3. No Categories Found**
```bash
⚠️ All items defaulting to 'Other' category
```
**Solution**: Verify vendor menu structure contains category information

**4. Rate Limiting**
```bash
❌ Quota exceeded error
```
**Solution**: The script includes delays, but you may need to run it during off-peak hours

### Verification Steps:

1. **Check a few orders manually**:
   ```javascript
   // In Firestore console, check that order items now have 'category' field
   ```

2. **Verify dashboard analytics**:
   - University Admin Dashboard → Analytics
   - Category Performance Breakdown should show real data
   - No more "Other: 100%" issues

3. **Test new orders**:
   - Place a test order to ensure new orders include categories
   - Check that the category is correctly assigned from menu data

## 📚 Related Files

- `scripts/addCategoryToOrders.js` - Main migration script
- `app/lib/models/database.ts` - Enhanced createOrder function
- `app/lib/models/index.ts` - Updated OrderItem interface
- `app/components/universityAdmin/AnalyticsCharts.tsx` - Updated analytics logic
- `database.md` - Updated database schema documentation

## 💡 Future Enhancements

After this migration, consider:
1. **Menu Validation**: Ensure all menu items have proper categories
2. **Category Standardization**: Standardize category names across vendors
3. **Analytics Expansion**: Add more category-based analytics features
4. **Real-time Updates**: Consider real-time category data synchronization
