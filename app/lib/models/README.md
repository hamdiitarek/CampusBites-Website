# Campus Bites - Database Models

A comprehensive TypeScript model system for the Campus Bites application, providing type safety, validation, and database operations.

## 📁 Structure

```
app/lib/models/
├── index.ts          # Core TypeScript interfaces and types
├── constants.ts      # Enums, constants, and messages
├── validators.ts     # Validation functions for all models
├── database.ts       # Database operation utilities
└── ../models.ts      # Main export file with utility functions
```

## 🚀 Quick Start

```typescript
// Import everything you need
import {
  User,
  Order,
  Vendor,
  USER_ROLES,
  ORDER_STATUS,
  validateUser,
  createUser,
  getUserById
} from '@/lib/models';

// Create a new user
const userData = {
  fullName: "Ahmed Hassan",
  email: "ahmed.hassan@students.eui.edu.eg",
  universityId: "20190001",
  universityName: "Egypt University of Informatics",
  role: USER_ROLES.STUDENT,
  walletBalance: 100
};

// Validate before creating
const validation = validateUser(userData);
if (validation.isValid) {
  const userId = await createUser(userData);
  console.log('User created:', userId);
} else {
  console.error('Validation errors:', validation.errors);
}
```

## 📋 Core Models

### User Model
```typescript
interface User {
  id: string;
  fullName: string;
  email: string;
  universityId: string;
  universityName: string;
  phoneNumber?: string;
  isEmailVerified: boolean;
  role: UserRole; // 'student' | 'vendor' | 'admin' | 'super-admin'
  walletBalance: number;
  profileImageUrl?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
```

### Order Model
```typescript
interface Order {
  id: string;
  userId: string;
  vendorId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus; // 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled'
  paymentMethod: PaymentMethod; // 'Wallet' | 'Cash'
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}
```

### Vendor Model
```typescript
interface Vendor {
  id: string;
  name: string;
  userId: string;
  universityId: string;
  universityName: string;
  description: string;
  imageUrl?: string;
  rating: number;
  reviewCount: number;
  categories: string[];
  isOpen: boolean;
  isApproved: boolean;
  isSuspended: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
```

## 🎯 Constants

All constants are strongly typed and centrally managed:

```typescript
// User roles
USER_ROLES.STUDENT        // 'student'
USER_ROLES.VENDOR         // 'vendor'
USER_ROLES.ADMIN          // 'admin'
USER_ROLES.SUPER_ADMIN    // 'super-admin'

// Order statuses
ORDER_STATUS.PENDING      // 'pending'
ORDER_STATUS.CONFIRMED    // 'confirmed'
ORDER_STATUS.READY        // 'ready'
ORDER_STATUS.COMPLETED    // 'completed'
ORDER_STATUS.CANCELLED    // 'cancelled'

// Collection names
COLLECTIONS.USERS         // 'users'
COLLECTIONS.VENDORS       // 'vendors'
COLLECTIONS.ORDERS        // 'orders'

// Default values
DEFAULT_VALUES.WALLET_BALANCE        // 0
DEFAULT_VALUES.PAGINATION_LIMIT      // 20
DEFAULT_VALUES.MAX_FILE_SIZE         // 5MB
```

## ✅ Validation

Every model has comprehensive validation:

```typescript
import { validateUser, validateOrder, validateCreateUserRequest } from '@/lib/models';

// Validate existing user data
const userValidation = validateUser(existingUser);
if (!userValidation.isValid) {
  console.error('User validation failed:', userValidation.errors);
}

// Validate new user creation
const createUserValidation = validateCreateUserRequest({
  fullName: "Sara Ahmed",
  email: "sara@guc.edu.eg",
  universityId: "20190002",
  universityName: "German University in Cairo",
  role: USER_ROLES.STUDENT,
  password: "secure123"
});

// Validate order before creation
const orderValidation = validateOrder(orderData);
```

## 🗄️ Database Operations

Simplified database operations with type safety:

```typescript
import {
  getUserById,
  createUser,
  updateUser,
  getUsersByFilter,
  getOrdersByFilter,
  createOrder
} from '@/lib/models';

// Get user by ID
const user = await getUserById('user-id-123');

// Create new user
const userId = await createUser({
  fullName: "Mohamed Ali",
  email: "mohamed@students.eui.edu.eg",
  // ... other required fields
});

// Update user
await updateUser('user-id-123', {
  phoneNumber: "01234567890",
  profileImageUrl: "https://example.com/avatar.jpg"
});

// Filter users
const students = await getUsersByFilter({
  role: USER_ROLES.STUDENT,
  universityName: "Egypt University of Informatics"
});

// Filter orders
const pendingOrders = await getOrdersByFilter({
  status: ORDER_STATUS.PENDING,
  vendorId: 'vendor-123'
});
```

## 🔍 Search Operations

Built-in search functionality:

```typescript
import { searchUsers, searchVendors } from '@/lib/models';

// Search users by name or email
const users = await searchUsers("ahmed", {
  role: USER_ROLES.STUDENT,
  universityName: "Egypt University of Informatics"
});

// Search vendors by name or description
const vendors = await searchVendors("pizza", {
  universityName: "German University in Cairo",
  isApproved: true
});
```

## 🛡️ Type Guards & Utilities

Convenient type guards and utility functions:

```typescript
import {
  isStudent,
  isVendor,
  isAdmin,
  canCancelOrder,
  isVendorAvailable,
  calculateOrderTotal,
  formatCurrency,
  getOrderStatusDisplayName
} from '@/lib/models';

// Type guards
if (isStudent(user)) {
  // User is definitely a student
  console.log('Student wallet balance:', user.walletBalance);
}

if (canCancelOrder(order)) {
  // Order can be cancelled
  await updateOrder(order.id, { status: ORDER_STATUS.CANCELLED });
}

// Utility functions
const total = calculateOrderTotal(orderItems);
const formattedPrice = formatCurrency(total); // "25.50 EGP"
const statusText = getOrderStatusDisplayName(order.status); // "Ready for Pickup"
```

## 📊 Filtering & Pagination

Advanced filtering with type safety:

```typescript
import { getOrdersByFilter, getPaginatedDocuments } from '@/lib/models';

// Date range filtering
const ordersToday = await getOrdersByFilter({
  dateFrom: new Date('2024-01-01'),
  dateTo: new Date('2024-01-02'),
  status: ORDER_STATUS.COMPLETED
});

// Paginated results
const paginatedOrders = await getPaginatedDocuments(
  COLLECTIONS.ORDERS,
  [where('status', '==', ORDER_STATUS.PENDING)],
  20 // page size
);

console.log('Has next page:', paginatedOrders.pagination.hasNext);
console.log('Orders:', paginatedOrders.data);
```

## 🔄 Real-world Usage Examples

### Creating a Complete Order Flow

```typescript
import {
  validateCreateOrderRequest,
  createOrder,
  updateUser,
  createNotification,
  ORDER_STATUS,
  NOTIFICATION_TYPES,
  calculateOrderTotal
} from '@/lib/models';

async function placeOrder(userId: string, orderRequest: CreateOrderRequest) {
  // 1. Validate the order request
  const validation = validateCreateOrderRequest(orderRequest);
  if (!validation.isValid) {
    throw new Error(`Invalid order: ${validation.errors.join(', ')}`);
  }

  // 2. Calculate total
  const total = calculateOrderTotal(orderRequest.items);

  // 3. Create the order
  const orderId = await createOrder({
    ...orderRequest,
    userId,
    total,
    status: ORDER_STATUS.PENDING,
    createdAt: Timestamp.now()
  });

  // 4. Update user wallet (if paying with wallet)
  if (orderRequest.paymentMethod === PAYMENT_METHODS.WALLET) {
    const user = await getUserById(userId);
    if (user && user.walletBalance >= total) {
      await updateUser(userId, {
        walletBalance: user.walletBalance - total
      });
    } else {
      throw new Error('Insufficient wallet balance');
    }
  }

  // 5. Send notification
  await createNotification({
    userId,
    title: 'Order Placed Successfully',
    body: `Your order ${generateOrderDisplayId(orderId)} has been placed.`,
    type: NOTIFICATION_TYPES.ORDER,
    status: NOTIFICATION_STATUS.SENT,
    createdAt: Timestamp.now()
  });

  return orderId;
}
```

### Admin Dashboard Data Loading

```typescript
import {
  getUsersByFilter,
  getOrdersByFilter,
  getVendorsByFilter,
  getAllUniversities,
  USER_ROLES
} from '@/lib/models';

async function loadDashboardData(universityName: string) {
  const [students, vendors, orders, universities] = await Promise.all([
    getUsersByFilter({ 
      role: USER_ROLES.STUDENT, 
      universityName 
    }),
    getVendorsByFilter({ 
      universityName,
      isApproved: true 
    }),
    getOrdersByFilter({ 
      dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
    }),
    getAllUniversities()
  ]);

  return {
    totalStudents: students.length,
    totalVendors: vendors.length,
    weeklyOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    universities: universities.length
  };
}
```

## 🚨 Error Handling

Built-in error messages and handling:

```typescript
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/lib/models';

try {
  const userId = await createUser(userData);
  console.log(SUCCESS_MESSAGES.PROFILE_UPDATED);
} catch (error) {
  if (error.message.includes('email')) {
    console.error(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
  } else {
    console.error(ERROR_MESSAGES.UNKNOWN_ERROR);
  }
}
```

## 🔧 Extending the Models

To add new fields or models:

1. **Add to interfaces** in `models/index.ts`
2. **Add constants** in `models/constants.ts` if needed
3. **Add validation** in `models/validators.ts`
4. **Add database operations** in `models/database.ts`
5. **Update the main export** in `models.ts`

Example - Adding a new field to User:

```typescript
// In models/index.ts
export interface User {
  // ... existing fields
  lastLoginAt?: Timestamp;  // New field
}

// In models/validators.ts
export const validateUser = (user: Partial<User>): ValidationResult => {
  // ... existing validation
  
  // New validation for lastLoginAt
  if (user.lastLoginAt && user.lastLoginAt.toDate() > new Date()) {
    errors.push('Last login cannot be in the future');
  }
  
  return createValidationResult(errors.length === 0, errors);
};
```

## 📝 Best Practices

1. **Always validate** data before database operations
2. **Use constants** instead of magic strings
3. **Leverage type guards** for runtime type checking
4. **Handle errors** gracefully with provided error messages
5. **Use utility functions** for common operations
6. **Filter data** at the database level when possible
7. **Use pagination** for large datasets

## 🔗 Integration with Existing Code

To migrate existing code to use these models:

```typescript
// Before
const user = {
  name: "Ahmed",
  email: "ahmed@eui.edu.eg",
  role: "student"
};

// After
const user: User = {
  id: "user-123",
  fullName: "Ahmed Hassan",
  email: "ahmed@students.eui.edu.eg",
  universityId: "20190001",
  universityName: "Egypt University of Informatics",
  role: USER_ROLES.STUDENT,
  walletBalance: 0,
  isEmailVerified: false
};

// Validate before using
const validation = validateUser(user);
if (validation.isValid) {
  // Safe to use
}
```

---

This model system provides a solid foundation for your Campus Bites application with type safety, validation, and maintainable database operations. All changes to the database structure can now be managed centrally through these models.
