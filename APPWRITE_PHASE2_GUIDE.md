# Appwrite Phase 2 Implementation Guide

## Overview

This document describes the implementation of **Phase 2: Database Schema Creation** for the Firebase to Appwrite migration.

## ✅ Phase 2 Completion Status

Phase 2 has been **COMPLETED** and includes:

- [x] Appwrite database creation script
- [x] Complete collection schema definitions
- [x] Permissions and security rules configuration
- [x] Storage bucket setup
- [x] Index creation for performance optimization
- [x] Verification script for schema validation
- [x] NPM scripts for easy execution
- [x] Comprehensive documentation

## 🚀 Quick Start

### Prerequisites

1. **Appwrite Project**: Create a project at [Appwrite Cloud](https://cloud.appwrite.io) or self-hosted instance
2. **API Key**: Generate a server API key with full database and storage permissions
3. **Environment Configuration**: Set up your environment variables

### Environment Setup

1. Copy the environment template:
```bash
cp .env.appwrite.example .env.local
```

2. Update `.env.local` with your Appwrite configuration:
```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=main

# Collection IDs (these will be created by the setup script)
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

# Storage
NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID=images

# Server API Key (required for schema setup)
APPWRITE_API_KEY=your-server-api-key
```

### Schema Setup

1. **Run the setup script**:
```bash
npm run appwrite:setup
```

2. **Verify the setup**:
```bash
npm run appwrite:verify
```

## 📋 Database Schema

### Collections Created

#### 1. **Users Collection**
- **Purpose**: Store user account information
- **Key Attributes**: id, fullName, email, universityId, role, walletBalance
- **Permissions**: Users can read/write their own data
- **Indexes**: email (unique), university, role

#### 2. **Vendors Collection**  
- **Purpose**: Store vendor business information
- **Key Attributes**: name, userId, universityName, isApproved, rating
- **Permissions**: Public read, vendor can update own data
- **Indexes**: userId (unique), university, status, categories

#### 3. **Orders Collection**
- **Purpose**: Store order transactions
- **Key Attributes**: userId, vendorId, items, total, status, timestamps
- **Permissions**: Users and vendors can access their orders
- **Indexes**: user, vendor, status, creation date

#### 4. **Universities Collection**
- **Purpose**: Store university information
- **Key Attributes**: name, emailDomain, city, isActive
- **Permissions**: Public read, admin write
- **Indexes**: emailDomain (unique), name, active status

#### 5. **Complaints Collection**
- **Purpose**: Store customer complaints
- **Key Attributes**: userId, vendorId, title, description, status
- **Permissions**: Users create/read own, admins manage all
- **Indexes**: user, vendor, status, priority

#### 6. **Notifications Collection**
- **Purpose**: Store user notifications
- **Key Attributes**: userId, title, body, type, status
- **Permissions**: Users read/update own notifications
- **Indexes**: user, status, type, creation date

#### 7. **Transactions Collection**
- **Purpose**: Store financial transactions
- **Key Attributes**: userId, type, amount, status, metadata
- **Permissions**: Users read own, admins manage all
- **Indexes**: user, type, status, order reference

#### 8. **Reviews Collection**
- **Purpose**: Store vendor reviews
- **Key Attributes**: userId, vendorId, orderId, rating, comment
- **Permissions**: Public read, users write own
- **Indexes**: user, vendor, order (unique), rating

#### 9. **One Time Codes Collection**
- **Purpose**: Store admin/vendor registration codes
- **Key Attributes**: code, type, universityId, isActive, usage tracking
- **Permissions**: Super admin only
- **Indexes**: code (unique), university, type, active status

#### 10. **Analytics Collection**
- **Purpose**: Store aggregated analytics data
- **Key Attributes**: date, totalOrders, totalRevenue, metrics
- **Permissions**: Admin read/write only
- **Indexes**: date, vendor, university

### Storage Bucket

**Images Bucket**: 
- **Purpose**: Store profile images, vendor logos, attachments
- **Permissions**: Users can upload, public read
- **File Types**: JPG, PNG, GIF, WebP
- **Size Limit**: 5MB per file

## 🔧 Scripts Usage

### Setup Script (`scripts/setupAppwriteSchema.js`)

**Purpose**: Creates the complete Appwrite database schema

**Usage**:
```bash
npm run appwrite:setup
```

**Features**:
- Creates database if it doesn't exist
- Creates all collections with proper attributes
- Sets up permissions and security rules
- Creates indexes for performance
- Sets up storage bucket
- Handles existing resources gracefully
- Provides detailed logging

### Verification Script (`scripts/verifyAppwriteSchema.js`)

**Purpose**: Verifies the schema is properly configured

**Usage**:
```bash
npm run appwrite:verify
```

**Checks**:
- Configuration validation
- Database existence
- Collection existence and structure
- Required attributes presence
- Storage bucket setup
- Generates comprehensive report

## 🔒 Security & Permissions

### Permission Strategy

1. **Users Collection**: Users can only access their own data
2. **Vendors Collection**: Public read for vendor discovery, vendors manage own data
3. **Orders Collection**: Users and related vendors can access order data
4. **Universities Collection**: Public read, admin-only write
5. **Complaints Collection**: Users create/read own, admins handle resolution
6. **Notifications Collection**: Users manage their own notifications
7. **Transactions Collection**: Users read own, admins have full access
8. **Reviews Collection**: Public read for transparency, users write own
9. **One Time Codes Collection**: Super admin exclusive access
10. **Analytics Collection**: Admin-only access for business intelligence

### Security Features

- **Role-based access control** using Appwrite's built-in permissions
- **Document-level security** for fine-grained access control
- **Attribute validation** with proper data types and constraints
- **Index optimization** for query performance
- **File upload restrictions** with size and type limits

## 🚦 Validation & Testing

### Automated Validation

The verification script checks:
- ✅ Environment configuration
- ✅ Database connectivity
- ✅ Collection existence
- ✅ Required attributes
- ✅ Storage bucket setup

### Manual Testing

After setup, you can test:

1. **Database Access**:
```javascript
import { databases } from '@/lib/appwrite';
const collections = await databases.listCollections('main');
```

2. **Storage Access**:
```javascript
import { storage } from '@/lib/appwrite';
const buckets = await storage.listBuckets();
```

## 🔄 Next Steps (Phase 3)

With Phase 2 complete, you can proceed to:

1. **Authentication Migration** - Switch from Firebase Auth to Appwrite Auth
2. **Data Layer Migration** - Update contexts and services to use Appwrite
3. **Real-time Features** - Implement Appwrite subscriptions
4. **Testing & Validation** - Comprehensive testing of the new backend

## 📞 Troubleshooting

### Common Issues

1. **Missing API Key**: Ensure `APPWRITE_API_KEY` is set in `.env.local`
2. **Permission Errors**: Verify your API key has database and storage permissions
3. **Rate Limiting**: The script includes delays to handle rate limits
4. **Existing Resources**: Script safely handles existing databases/collections

### Error Resolution

- **409 Conflicts**: Resources already exist (safe to ignore)
- **401 Unauthorized**: Check API key and permissions
- **404 Not Found**: Verify project ID and endpoint
- **429 Rate Limited**: Wait and retry, script handles this automatically

### Getting Help

1. Check the verification report for specific issues
2. Review Appwrite console for detailed error messages
3. Ensure all environment variables are correctly set
4. Verify network connectivity to Appwrite endpoint

## 📈 Performance Considerations

### Indexes Created

- **Email lookups**: Unique index on user emails
- **University filtering**: Index on university names
- **Order queries**: Indexes on user, vendor, status, dates
- **Search functionality**: Full-text indexes on categories
- **Analytics queries**: Date-based indexes for reporting

### Query Optimization

The schema is designed for:
- Fast user authentication and profile lookups
- Efficient vendor and menu browsing
- Quick order status tracking
- Scalable analytics queries
- Responsive search functionality

---

## 🎉 Phase 2 Complete!

The Appwrite database schema is now fully configured and ready for use. The migration infrastructure provides:

- **Complete data model** matching Firebase schema
- **Optimized performance** with proper indexing
- **Secure access control** with role-based permissions
- **Scalable architecture** for future growth
- **Developer-friendly tools** for management and verification

You can now proceed to Phase 3: Authentication Migration with confidence that the data layer is properly established.