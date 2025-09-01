# Firebase to Appwrite Migration Guide

This guide documents the migration from Firebase to Appwrite for the CampusBites website.

## Overview

The migration maintains all existing Firebase data while setting up Appwrite as the new backend. This allows for:
- Zero downtime migration
- Data consistency preservation
- Gradual feature rollout
- Easy rollback if needed

## Migration Strategy

### Phase 1: Setup and Configuration (Current)
- [x] Install Appwrite SDK
- [x] Create Appwrite configuration
- [x] Implement Appwrite service layer
- [x] Create Appwrite-compatible contexts and hooks

### Phase 2: Database Schema Creation (COMPLETED ✅)
- [x] Set up Appwrite project and database
- [x] Create collections matching Firebase schema
- [x] Configure permissions and security rules
- [x] Set up storage buckets
- [x] Create database indexes for performance
- [x] Implement automated setup script
- [x] Create verification script
- [x] Add npm scripts for easy execution

### Phase 3: Authentication Migration
- [ ] Replace Firebase Auth with Appwrite Auth
- [ ] Migrate existing user accounts (optional)
- [ ] Update login/signup flows
- [ ] Test authentication features

### Phase 4: Data Layer Migration
- [ ] Switch contexts to use Appwrite
- [ ] Update all components to use new services
- [ ] Migrate real-time functionality
- [ ] Test all CRUD operations

### Phase 5: Testing and Validation
- [ ] Run comprehensive tests
- [ ] Validate data integrity
- [ ] Performance testing
- [ ] Security testing

## File Changes

### New Files Created
- `app/lib/appwrite.ts` - Appwrite configuration
- `app/lib/appwriteService.ts` - Service layer with Firebase compatibility
- `app/contexts/AppwriteAuthContext.tsx` - Appwrite-based authentication
- `app/hooks/useAppwriteRealtimeData.ts` - Real-time data hook
- `.env.appwrite.example` - Environment configuration template

### Files to be Modified
- `app/contexts/AuthContext.tsx` - Switch to Appwrite implementation
- `app/hooks/useRealtimeData.ts` - Switch to Appwrite implementation
- Components using Firebase imports
- Service files using Firebase operations

## Appwrite Project Setup

### Database Schema

#### Collections to Create

1. **users** collection
   - Attributes: fullName, email, universityId, universityName, phoneNumber, isEmailVerified, role, walletBalance, profileImageUrl
   - Permissions: User can read/write own document

2. **vendors** collection
   - Attributes: name, userId, universityId, universityName, description, imageUrl, rating, reviewCount, categories, isOpen, isApproved, isSuspended
   - Permissions: Vendor can read/write own document, others can read

3. **orders** collection
   - Attributes: userId, vendorId, items, total, status, paymentMethod, confirmedAt, readyAt, completedAt, cancelledAt, statusHistory
   - Permissions: User and vendor can read own orders, vendor can update order status

4. **universities** collection
   - Attributes: name, emailDomain
   - Permissions: Public read

5. **complaints** collection
   - Attributes: userId, vendorId, orderId, title, description, status, resolvedAt, resolution, adminId
   - Permissions: User can create/read own complaints, admin can read/update all

6. **notifications** collection
   - Attributes: userId, title, body, status, read
   - Permissions: User can read/update own notifications

### Security Rules

Appwrite uses attribute-level and document-level permissions:

```javascript
// Example collection permissions
// Users collection
- Create: users
- Read: users (own documents)
- Update: users (own documents)
- Delete: users (own documents)

// Vendors collection  
- Create: vendors
- Read: any (public read for vendor listings)
- Update: vendors (own documents)
- Delete: admins

// Orders collection
- Create: users
- Read: users (own orders), vendors (own orders)
- Update: vendors (status updates only)
- Delete: admins
```

## Environment Configuration

Create `.env.local` with Appwrite configuration:

```bash
# Copy from .env.appwrite.example
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=main

# Collection IDs (created in Appwrite console)
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=users
NEXT_PUBLIC_APPWRITE_VENDORS_COLLECTION_ID=vendors
NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID=orders
NEXT_PUBLIC_APPWRITE_UNIVERSITIES_COLLECTION_ID=universities
NEXT_PUBLIC_APPWRITE_COMPLAINTS_COLLECTION_ID=complaints
NEXT_PUBLIC_APPWRITE_NOTIFICATIONS_COLLECTION_ID=notifications

# Storage
NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID=images
```

## Implementation Details

### Service Layer Compatibility

The `appwriteService.ts` provides Firebase-compatible methods:

```typescript
// Firebase style
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';

// Appwrite compatible
import { collection, doc, userService } from '@/lib/appwriteService';

// Same API, different backend
const userData = await userService.getUser(userId);
```

### Authentication Migration

The new AuthContext maintains the same interface:

```typescript
// Same hooks and methods
const { user, login, logout, register } = useAuth();
```

### Real-time Features

Appwrite real-time uses WebSocket subscriptions:

```typescript
// Subscribe to collection changes
const unsubscribe = client.subscribe(
  `databases.${databaseId}.collections.${collectionId}.documents`,
  callback
);
```

## Testing Strategy

1. **Unit Tests**: Test service layer methods
2. **Integration Tests**: Test auth and data flows
3. **E2E Tests**: Test complete user journeys
4. **Performance Tests**: Compare with Firebase performance
5. **Security Tests**: Validate permissions and access control

## Rollback Plan

If rollback is needed:
1. Switch environment variables back to Firebase
2. Revert context imports
3. Clear Appwrite-specific state
4. Redeploy previous version

## Benefits of Migration

1. **Cost Efficiency**: Appwrite's pricing model
2. **Self-hosting Option**: Can deploy on own infrastructure
3. **Open Source**: Full control and transparency
4. **Feature Parity**: All Firebase features replicated
5. **Better Developer Experience**: More intuitive APIs

## Known Limitations

1. **Learning Curve**: Team needs to learn Appwrite APIs
2. **Ecosystem**: Smaller community compared to Firebase
3. **Migration Complexity**: Data migration may be complex
4. **Real-time Performance**: May differ from Firebase real-time

## Next Steps

1. Create Appwrite project and configure collections
2. Run database schema creation scripts
3. Update environment variables
4. Switch contexts to use Appwrite
5. Comprehensive testing
6. Gradual deployment

---

*Last Updated: Current Date*
*Migration Status: Phase 1 Complete - Setup and Configuration*