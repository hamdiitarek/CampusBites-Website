# Appwrite Menu Collections Update

## Overview
This update modernizes the Appwrite setup by implementing a proper menu structure with separate collections for better data organization and query performance, similar to the Firebase implementation.

## New Collections Added

### 1. Menus Collection (`menus`)
- **Purpose**: Represents the main menu containers for each vendor
- **Key Fields**:
  - `id` (string): Unique menu identifier
  - `vendorId` (string): Reference to the vendor
  - `name` (string): Menu name (e.g., "Main Menu")
  - `nameAr` (string): Arabic menu name
  - `description` (string): Menu description
  - `isActive` (boolean): Whether the menu is active
  - `displayOrder` (integer): Menu display order
  - `imageUrl` (url): Optional menu image

### 2. Categories Collection (`categories`)
- **Purpose**: Organizes menu items into logical categories
- **Key Fields**:
  - `id` (string): Unique category identifier
  - `vendorId` (string): Reference to the vendor
  - `menuId` (string): Reference to the parent menu
  - `name` (string): Category name (e.g., "Coffee & Beverages")
  - `nameAr` (string): Arabic category name (e.g., "القهوة والمشروبات")
  - `description` (string): Category description
  - `isActive` (boolean): Whether the category is active
  - `displayOrder` (integer): Category display order
  - `imageUrl` (url): Optional category image

### 3. Menu Items Collection (`menuItems`)
- **Purpose**: Individual menu items with detailed information
- **Key Fields**:
  - `id` (string): Unique item identifier
  - `vendorId` (string): Reference to the vendor
  - `menuId` (string): Reference to the parent menu
  - `categoryId` (string): Reference to the parent category
  - `name` (string): Item name (e.g., "Cappuccino")
  - `nameAr` (string): Arabic item name (e.g., "كابتشينو")
  - `description` (string): Item description
  - `price` (float): Item price
  - `isAvailable` (boolean): Whether the item is available
  - `popularity` (integer): Popularity score (0-100)
  - `imageUrl` (url): Optional item image
  - `customizationOptions` (string): JSON string of customization options
  - `allergens` (string): JSON array of allergens
  - `nutritionalInfo` (string): JSON object with nutritional information
  - `preparationTime` (integer): Preparation time in minutes
  - `displayOrder` (integer): Item display order
  - `tags` (string): JSON array of tags

## Updated Environment Variables

Add these new collection IDs to your `.env.local` file:

```bash
# New Menu Collections
NEXT_PUBLIC_APPWRITE_MENUS_COLLECTION_ID=menus
NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID=categories
NEXT_PUBLIC_APPWRITE_MENU_ITEMS_COLLECTION_ID=menuItems
```

## Schema Setup

1. **Run the schema setup script** to create the new collections:
   ```bash
   node scripts/setupAppwriteSchema.cjs
   ```

2. **Verify collections** are created in your Appwrite console under Database > Collections

## Demo Data Updates

The demo data setup script has been enhanced with:

### New Features
- **Structured Menu Creation**: Menus are now created as separate documents
- **Arabic Support**: All menu items include Arabic names (e.g., "كابتشينو" for Cappuccino)
- **Category Organization**: Items are properly organized into categories
- **Enhanced Cleanup**: New cleanup functions for menu-related collections

### Updated Commands
```bash
# Standard setup (creates new menu structure)
npm run appwrite:demo

# Setup with cleanup (removes old menu data first)
npm run appwrite:demo:clean

# Cleanup only (removes orders and menu data)
npm run appwrite:demo:cleanup
```

## Data Structure Example

The new structure creates a hierarchy:

```
Vendor: "قهوة الجامعة - University Café"
└── Menu: "Main Menu"
    ├── Category: "Coffee & Beverages" (القهوة والمشروبات)
    │   ├── Item: "Espresso" (إسبريسو) - 15 EGP
    │   ├── Item: "Cappuccino" (كابتشينو) - 25 EGP
    │   └── Item: "Caffe Latte" (لاتيه) - 30 EGP
    └── Category: "Sandwiches" (الساندوتشات)
        ├── Item: "Club Sandwich" (ساندوتش كلوب) - 45 EGP
        └── Item: "Grilled Cheese" (جبنة مشوية) - 35 EGP
```

## Benefits

### 1. Better Query Performance
- Individual collections can be queried independently
- Indexes optimized for specific use cases
- Faster menu loading with targeted queries

### 2. Scalability
- Can handle large menus with many items
- Easy to add new menu types or categories
- Better memory usage for mobile apps

### 3. Multilingual Support
- Native support for Arabic and English names
- Easy to add more languages in the future

### 4. Flexibility
- Menu items can have detailed customization options
- Support for nutritional information and allergens
- Easy to implement features like "most popular items"

### 5. Data Integrity
- Proper relationships between vendors, menus, categories, and items
- Consistent data structure across all vendors

## Migration from Old Structure

If you have existing data with menu stored as JSON in vendor documents:

1. **Backup your data** before running the updated setup
2. **Run cleanup** to remove old menu data: `npm run appwrite:demo:cleanup`
3. **Run new setup** to create structured menu data: `npm run appwrite:demo`

## Integration Notes

When updating your frontend code:

### Old Query (JSON menu field)
```javascript
// Old way - querying vendor with embedded menu
const vendor = await databases.getDocument(databaseId, 'vendors', vendorId);
const menu = JSON.parse(vendor.menu);
```

### New Query (Structured collections)
```javascript
// New way - querying separate collections
const vendor = await databases.getDocument(databaseId, 'vendors', vendorId);
const menus = await databases.listDocuments(databaseId, 'menus', [
  Query.equal('vendorId', vendorId),
  Query.equal('isActive', true)
]);
const categories = await databases.listDocuments(databaseId, 'categories', [
  Query.equal('vendorId', vendorId),
  Query.equal('isActive', true),
  Query.orderAsc('displayOrder')
]);
const menuItems = await databases.listDocuments(databaseId, 'menuItems', [
  Query.equal('vendorId', vendorId),
  Query.equal('isAvailable', true),
  Query.orderAsc('displayOrder')
]);
```

## Testing

After running the setup:

1. **Check Appwrite Console**: Verify all collections are created with proper data
2. **Test Queries**: Ensure you can retrieve menus, categories, and items
3. **Verify Relationships**: Check that vendorId, menuId, and categoryId references are correct
4. **Test Arabic Content**: Verify Arabic names are properly stored and retrieved

## Troubleshooting

### Common Issues

1. **Collection Not Found**: Ensure you've run the schema setup script first
2. **Permission Errors**: Verify your API key has proper permissions
3. **Arabic Text Issues**: Ensure your database supports UTF-8 encoding

### Debug Commands

```bash
# Verify schema creation
node scripts/verifyAppwriteSchema.cjs

# Test demo data creation (dry run)
node scripts/setup_demo_data_appwrite_comprehensive.cjs --dry-run
```

## Next Steps

1. **Update Frontend Code**: Implement new query structure in your app
2. **Add Search Features**: Implement menu item search across categories
3. **Implement Filters**: Add filtering by price, popularity, or dietary restrictions
4. **Add Analytics**: Track popular items and categories for insights

This update provides a solid foundation for a scalable, multilingual menu system that can grow with your application's needs.
