# Appwrite Demo Data Setup Guide

This guide covers setting up comprehensive demo data for the CampusBites application using Appwrite as the backend database.

## Overview

The Appwrite demo setup creates a complete, realistic dataset for testing and development:

- **University**: Egypt University of Informatics with Arabic/English details
- **Students**: 5 demo students with Egyptian names and varying wallet balances
- **Vendors**: 3 themed food vendors (Coffee, Pizza, Healthy) with structured menu system
- **Menu Structure**: Separate collections for menus, categories, and menu items
- **Multilingual Support**: Arabic and English names for all menu items
- **Orders**: 200-300 realistic orders spanning the last 3 months
- **Order Timing**: Sunday-Thursday only, 9:15 AM to 3:30 PM (realistic university hours)
- **Order Status Mix**: 88% completed, 4% ready, 4% confirmed, 4% pending
- **Payment Methods**: 70% Wallet, 30% Cash

## Database Structure

The setup creates the following collections:

### Core Collections
- `users` - Student and vendor user accounts
- `vendors` - Vendor business information
- `universities` - University details
- `orders` - Order transactions and history

### Menu Management Collections
- `menus` - Main menu containers for vendors
- `categories` - Menu categories (Coffee, Pizza, Salads, etc.)
- `menuItems` - Individual menu items with pricing and customizations

### Additional Collections
- `complaints` - Customer complaints and feedback
- `notifications` - System notifications
- `transactions` - Financial transaction records
- `reviews` - Customer reviews and ratings
- `oneTimeCodes` - Access codes for university registration
- `analytics` - Performance and analytics data

## Prerequisites

1. **Appwrite Project Setup**: Ensure you have an Appwrite project configured
2. **Database Schema**: Run the schema setup first
3. **Environment Variables**: Configure your `.env.local` file

### Required Environment Variables

```bash
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=main

# Collection IDs
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=users
NEXT_PUBLIC_APPWRITE_VENDORS_COLLECTION_ID=vendors
NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID=orders
NEXT_PUBLIC_APPWRITE_UNIVERSITIES_COLLECTION_ID=universities
NEXT_PUBLIC_APPWRITE_COMPLAINTS_COLLECTION_ID=complaints
NEXT_PUBLIC_APPWRITE_NOTIFICATIONS_COLLECTION_ID=notifications
NEXT_PUBLIC_APPWRITE_TRANSACTIONS_COLLECTION_ID=transactions
NEXT_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID=reviews
NEXT_PUBLIC_APPWRITE_ONE_TIME_CODES_COLLECTION_ID=oneTimeCodes
NEXT_PUBLIC_APPWRITE_ANALYTICS_COLLECTION_ID=analytics
NEXT_PUBLIC_APPWRITE_MENUS_COLLECTION_ID=menus
NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID=categories
NEXT_PUBLIC_APPWRITE_MENU_ITEMS_COLLECTION_ID=menuItems

# Server API Key (required for demo data creation)
APPWRITE_API_KEY=your-server-api-key
```

## Quick Start

### 1. Setup Appwrite Schema (First Time Only)

```bash
npm run appwrite:setup
```

This creates the database and all required collections with proper attributes and permissions.

### 2. Verify Schema Setup

```bash
npm run appwrite:verify
```

Validates that all collections and attributes are properly configured.

### 3. Create Demo Data

```bash
# Create demo data (preserves existing data)
npm run appwrite:demo

# Or create demo data with cleanup (removes existing orders)
npm run appwrite:demo:clean
```

### 4. Clean Orders Only (Optional)

```bash
# Remove all orders without affecting users/vendors
npm run appwrite:demo:cleanup
```

## Demo Data Details

### University
- **Name**: Egypt University of Informatics / جامعة مصر للمعلوماتية
- **Location**: New Cairo, Egypt
- **Email Domain**: students.eui.edu.eg

### Demo Students
| Name | Email | Password | University ID | Wallet Balance |
|------|-------|----------|---------------|----------------|
| Mohamed Abdelrahman | mohamed.abdelrahman@students.eui.edu.eg | demo123456 | 21-102001 | 150 EGP |
| Yasmin Mahmoud | yasmin.mahmoud@students.eui.edu.eg | demo123456 | 21-102002 | 200 EGP |
| Karim El-Shafei | karim.elshafei@students.eui.edu.eg | demo123456 | 21-102003 | 100 EGP |
| Nour Hassan | nour.hassan@students.eui.edu.eg | demo123456 | 21-102004 | 250 EGP |
| Youssef Ahmed | youssef.ahmed@students.eui.edu.eg | demo123456 | 21-102005 | 80 EGP |

### Demo Vendors

#### 1. قهوة الجامعة - University Café
- **Email**: university.cafe@students.eui.edu.eg
- **Password**: vendor123456
- **Specialties**: Coffee, Sandwiches, Pastries
- **Rating**: 4.5/5 (42 reviews)
- **Menu Items**:
  - Espresso (15 EGP)
  - Cappuccino (25 EGP)
  - Caffe Latte (30 EGP)
  - Club Sandwich (45 EGP)
  - Grilled Cheese (35 EGP)

#### 2. بيتزا النيل - Pizza El-Nil
- **Email**: pizza.elnil@students.eui.edu.eg
- **Password**: vendor123456
- **Specialties**: Pizza, Pasta, Italian
- **Rating**: 4.3/5 (67 reviews)
- **Menu Items**:
  - Margherita Pizza (60 EGP)
  - Pepperoni Pizza (75 EGP)
  - Spaghetti Carbonara (55 EGP)

#### 3. الأكل الصحي - Healthy Choice
- **Email**: healthy.choice@students.eui.edu.eg
- **Password**: vendor123456
- **Specialties**: Salads, Wraps, Healthy
- **Rating**: 4.7/5 (29 reviews)
- **Menu Items**:
  - Caesar Salad (40 EGP)
  - Greek Salad (45 EGP)
  - Grilled Chicken Wrap (35 EGP)

### Order Generation Features

#### Realistic Timing
- **Days**: Sunday to Thursday only (no Friday/Saturday orders)
- **Hours**: 9:15 AM to 3:30 PM (university operating hours)
- **Distribution**: Random but realistic meal times

#### Order Status Distribution
- **88% Completed**: Orders with full completion timeline
- **4% Ready**: Orders ready for pickup
- **4% Confirmed**: Orders being prepared
- **4% Pending**: Orders awaiting vendor confirmation

#### Payment Methods
- **70% Wallet**: Digital wallet payments
- **30% Cash**: Cash on delivery

#### Order Features
- **Random Items**: 1-3 items per order from vendor menus
- **Customizations**: Realistic add-ons and modifications
- **Completion Times**: 5-30 minutes processing time
- **Status History**: Complete timeline tracking
- **Customer Notes**: Optional special requests

## Usage Examples

### Create Fresh Demo Environment
```bash
# 1. Setup schema
npm run appwrite:setup

# 2. Verify setup
npm run appwrite:verify

# 3. Create demo data with cleanup
npm run appwrite:demo:clean
```

### Add More Orders (Keep Existing Data)
```bash
npm run appwrite:demo
```

### Clean Orders Only (Keep Users/Vendors)
```bash
npm run appwrite:demo:cleanup
```

## Login Testing

After running the demo setup, you can test login with any of the demo accounts:

### Student Login
- Go to: `http://localhost:3000/en/login`
- Use any student email/password from the table above
- Test wallet payments, order history, etc.

### Vendor Login
- Go to: `http://localhost:3000/en/login`
- Use any vendor email with password `vendor123456`
- Test order management, menu updates, etc.

## Analytics & Dashboard Testing

The generated orders provide rich data for testing:

- **University Admin Dashboard**: View analytics for Egypt University of Informatics
- **Vendor Performance**: Compare vendor statistics
- **Order Trends**: Analyze order patterns over time
- **Revenue Analytics**: Track payment methods and totals
- **Student Engagement**: Monitor user activity

## Troubleshooting

### Schema Issues
```bash
# Verify schema setup
npm run appwrite:verify

# Re-run schema setup if needed
npm run appwrite:setup
```

### Permission Errors
Ensure your `APPWRITE_API_KEY` has the following permissions:
- Database: Read, Write
- Users: Read, Write
- Storage: Read, Write (if using file uploads)

### Data Conflicts
```bash
# Clean existing orders and recreate
npm run appwrite:demo:clean
```

## File Structure

```
scripts/
├── setup_demo_data_appwrite_comprehensive.cjs  # Main demo setup script
├── setupAppwriteSchema.cjs                     # Schema creation
├── verifyAppwriteSchema.cjs                    # Schema verification
└── createTestAccounts.js                       # Additional test accounts
```

## Statistics Output

After successful creation, the script outputs:

```
📊 Order Statistics:
   💰 Total Revenue: ~15,000-20,000 EGP
   💳 Wallet Orders: ~70%
   💵 Cash Orders: ~30%

📈 Order Status Distribution:
   ✅ Completed: ~88%
   🍽️ Ready: ~4%
   👨‍🍳 Confirmed: ~4%
   ⏳ Pending: ~4%

🏪 Orders per Vendor:
   - University Café: ~33% (Coffee & Sandwiches)
   - Pizza El-Nil: ~33% (Pizza & Pasta)
   - Healthy Choice: ~33% (Salads & Wraps)

🍽️ Menu Structure Created:
   - 3 Main Menus (one per vendor)
   - 6 Categories (2 per vendor)
   - 15+ Menu Items with Arabic/English names
   - Customization options for all items
   - Realistic pricing and popularity scores
```

## Menu Structure Details

Each vendor gets a complete menu hierarchy:

### University Café (قهوة الجامعة)
- **Coffee & Beverages** (القهوة والمشروبات)
  - Espresso (إسبريسو) - 15 EGP
  - Cappuccino (كابتشينو) - 25 EGP
  - Caffe Latte (لاتيه) - 30 EGP
- **Sandwiches** (الساندوتشات)
  - Club Sandwich (ساندوتش كلوب) - 45 EGP
  - Grilled Cheese (جبنة مشوية) - 35 EGP

### Pizza El-Nil (بيتزا النيل)
- **Pizza** (البيتزا)
  - Margherita Pizza (بيتزا مارجريتا) - 60 EGP
  - Pepperoni Pizza (بيتزا البيبروني) - 75 EGP
- **Pasta** (المعكرونة)
  - Spaghetti Carbonara (سباجيتي كاربونارا) - 55 EGP

### Healthy Choice (الأكل الصحي)
- **Fresh Salads** (السلطات الطازجة)
  - Caesar Salad (سلطة سيزار) - 40 EGP
  - Greek Salad (السلطة اليونانية) - 45 EGP
- **Wraps** (اللفائف)
  - Grilled Chicken Wrap (لفافة الدجاج المشوي) - 35 EGP

This comprehensive demo setup provides a realistic testing environment for all aspects of the CampusBites application including multilingual menu management.
