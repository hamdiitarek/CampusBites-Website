/**
 * Campus Bites - Model Validation Utilities
 * Validation functions for database models
 */

import type {
  User,
  Vendor,
  Order,
  OrderItem,
  MenuItem,
  Complaint,
  Notification,
  Transaction,
  CreateUserRequest,
  CreateVendorRequest,
  CreateOrderRequest
} from './index';
import {
  USER_ROLES,
  ORDER_STATUS,
  PAYMENT_METHODS,
  COMPLAINT_STATUS,
  NOTIFICATION_TYPES,
  NOTIFICATION_STATUS,
  TRANSACTION_TYPES,
  TRANSACTION_STATUS,
  UNIVERSITY_DOMAINS,
  VALIDATION_RULES,
  ERROR_MESSAGES
} from './constants';

// ========================================
// Validation Result Type
// ========================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// ========================================
// Helper Functions
// ========================================

const createValidationResult = (isValid: boolean, errors: string[] = []): ValidationResult => ({
  isValid,
  errors
});

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidUniversityEmail = (email: string): boolean => {
  const domain = email.split('@')[1];
  return domain && Object.keys(UNIVERSITY_DOMAINS).includes(domain);
};

const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\d{11}$/;
  return phoneRegex.test(phone);
};

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// ========================================
// User Validation
// ========================================

export const validateUser = (user: Partial<User>): ValidationResult => {
  const errors: string[] = [];

  // Required fields
  if (!user.fullName?.trim()) {
    errors.push('Full name is required');
  }

  if (!user.email?.trim()) {
    errors.push('Email is required');
  } else if (!isValidEmail(user.email)) {
    errors.push('Invalid email format');
  } else if (!isValidUniversityEmail(user.email)) {
    errors.push(ERROR_MESSAGES.INVALID_EMAIL_DOMAIN);
  }

  if (!user.universityId?.trim()) {
    errors.push('University ID is required');
  }

  if (!user.universityName?.trim()) {
    errors.push('University name is required');
  }

  if (!user.role || !Object.values(USER_ROLES).includes(user.role)) {
    errors.push('Valid role is required');
  }

  // Optional field validations
  if (user.phoneNumber && !isValidPhoneNumber(user.phoneNumber)) {
    errors.push(`Phone number must be ${VALIDATION_RULES.PHONE_NUMBER_LENGTH} digits`);
  }

  if (user.profileImageUrl && !isValidUrl(user.profileImageUrl)) {
    errors.push('Invalid profile image URL');
  }

  if (user.walletBalance !== undefined && user.walletBalance < 0) {
    errors.push('Wallet balance cannot be negative');
  }

  return createValidationResult(errors.length === 0, errors);
};

export const validateCreateUserRequest = (request: CreateUserRequest): ValidationResult => {
  const errors: string[] = [];

  // Validate user data
  const userValidation = validateUser(request);
  errors.push(...userValidation.errors);

  // Password validation
  if (!request.password || request.password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`);
  }

  return createValidationResult(errors.length === 0, errors);
};

// ========================================
// Vendor Validation
// ========================================

export const validateVendor = (vendor: Partial<Vendor>): ValidationResult => {
  const errors: string[] = [];

  // Required fields
  if (!vendor.name?.trim()) {
    errors.push('Vendor name is required');
  } else if (vendor.name.length > VALIDATION_RULES.MAX_ITEM_NAME_LENGTH) {
    errors.push(`Vendor name must be less than ${VALIDATION_RULES.MAX_ITEM_NAME_LENGTH} characters`);
  }

  if (!vendor.description?.trim()) {
    errors.push('Description is required');
  } else if (vendor.description.length > VALIDATION_RULES.MAX_DESCRIPTION_LENGTH) {
    errors.push(`Description must be less than ${VALIDATION_RULES.MAX_DESCRIPTION_LENGTH} characters`);
  }

  if (!vendor.categories || vendor.categories.length === 0) {
    errors.push('At least one category is required');
  }

  if (!vendor.universityName?.trim()) {
    errors.push('University name is required');
  }

  // Optional field validations
  if (vendor.imageUrl && !isValidUrl(vendor.imageUrl)) {
    errors.push('Invalid image URL');
  }

  if (vendor.rating !== undefined && (vendor.rating < VALIDATION_RULES.MIN_RATING || vendor.rating > VALIDATION_RULES.MAX_RATING)) {
    errors.push(`Rating must be between ${VALIDATION_RULES.MIN_RATING} and ${VALIDATION_RULES.MAX_RATING}`);
  }

  return createValidationResult(errors.length === 0, errors);
};

export const validateCreateVendorRequest = (request: CreateVendorRequest): ValidationResult => {
  return validateVendor(request);
};

// ========================================
// Menu Item Validation
// ========================================

export const validateMenuItem = (item: Partial<MenuItem>): ValidationResult => {
  const errors: string[] = [];

  // Required fields
  if (!item.Name?.trim()) {
    errors.push('Item name is required');
  } else if (item.Name.length > VALIDATION_RULES.MAX_ITEM_NAME_LENGTH) {
    errors.push(`Item name must be less than ${VALIDATION_RULES.MAX_ITEM_NAME_LENGTH} characters`);
  }

  if (!item.Description?.trim()) {
    errors.push('Item description is required');
  } else if (item.Description.length > VALIDATION_RULES.MAX_DESCRIPTION_LENGTH) {
    errors.push(`Description must be less than ${VALIDATION_RULES.MAX_DESCRIPTION_LENGTH} characters`);
  }

  if (item.Price === undefined || item.Price <= 0) {
    errors.push('Price must be greater than 0');
  }

  if (!item.Category?.trim()) {
    errors.push('Category is required');
  }

  // Optional field validations
  if (item.ImagePath && !isValidUrl(item.ImagePath)) {
    errors.push('Invalid image URL');
  }

  if (item.Popularity !== undefined && item.Popularity < 0) {
    errors.push('Popularity cannot be negative');
  }

  return createValidationResult(errors.length === 0, errors);
};

// ========================================
// Order Validation
// ========================================

export const validateOrderItem = (item: Partial<OrderItem>): ValidationResult => {
  const errors: string[] = [];

  if (!item.name?.trim()) {
    errors.push('Item name is required');
  }

  if (item.price === undefined || item.price <= 0) {
    errors.push('Item price must be greater than 0');
  }

  if (item.quantity === undefined || item.quantity <= 0) {
    errors.push('Item quantity must be greater than 0');
  } else if (item.quantity > VALIDATION_RULES.MAX_QUANTITY) {
    errors.push(`Item quantity cannot exceed ${VALIDATION_RULES.MAX_QUANTITY}`);
  }

  return createValidationResult(errors.length === 0, errors);
};

export const validateOrder = (order: Partial<Order>): ValidationResult => {
  const errors: string[] = [];

  // Required fields
  if (!order.userId?.trim()) {
    errors.push('User ID is required');
  }

  if (!order.vendorId?.trim()) {
    errors.push('Vendor ID is required');
  }

  if (!order.items || order.items.length === 0) {
    errors.push('At least one item is required');
  } else {
    // Validate each item
    order.items.forEach((item, index) => {
      const itemValidation = validateOrderItem(item);
      if (!itemValidation.isValid) {
        errors.push(...itemValidation.errors.map(error => `Item ${index + 1}: ${error}`));
      }
    });
  }

  if (order.total === undefined || order.total <= 0) {
    errors.push('Order total must be greater than 0');
  }

  if (!order.status || !Object.values(ORDER_STATUS).includes(order.status)) {
    errors.push('Valid order status is required');
  }

  if (!order.paymentMethod || !Object.values(PAYMENT_METHODS).includes(order.paymentMethod)) {
    errors.push('Valid payment method is required');
  }

  return createValidationResult(errors.length === 0, errors);
};

export const validateCreateOrderRequest = (request: CreateOrderRequest): ValidationResult => {
  const errors: string[] = [];

  if (!request.vendorId?.trim()) {
    errors.push('Vendor ID is required');
  }

  if (!request.items || request.items.length === 0) {
    errors.push('At least one item is required');
  } else {
    // Validate each item
    request.items.forEach((item, index) => {
      if (!item.name?.trim()) {
        errors.push(`Item ${index + 1}: Name is required`);
      }
      if (item.price === undefined || item.price <= 0) {
        errors.push(`Item ${index + 1}: Price must be greater than 0`);
      }
      if (item.quantity === undefined || item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
      }
    });
  }

  if (!request.paymentMethod || !Object.values(PAYMENT_METHODS).includes(request.paymentMethod)) {
    errors.push('Valid payment method is required');
  }

  return createValidationResult(errors.length === 0, errors);
};

// ========================================
// Complaint Validation
// ========================================

export const validateComplaint = (complaint: Partial<Complaint>): ValidationResult => {
  const errors: string[] = [];

  // Required fields
  if (!complaint.userId?.trim()) {
    errors.push('User ID is required');
  }

  if (!complaint.vendorId?.trim()) {
    errors.push('Vendor ID is required');
  }

  if (!complaint.title?.trim()) {
    errors.push('Title is required');
  } else if (complaint.title.length > VALIDATION_RULES.MAX_COMPLAINT_TITLE_LENGTH) {
    errors.push(`Title must be less than ${VALIDATION_RULES.MAX_COMPLAINT_TITLE_LENGTH} characters`);
  }

  if (!complaint.description?.trim()) {
    errors.push('Description is required');
  } else if (complaint.description.length > VALIDATION_RULES.MAX_COMPLAINT_DESCRIPTION_LENGTH) {
    errors.push(`Description must be less than ${VALIDATION_RULES.MAX_COMPLAINT_DESCRIPTION_LENGTH} characters`);
  }

  if (!complaint.status || !Object.values(COMPLAINT_STATUS).includes(complaint.status)) {
    errors.push('Valid status is required');
  }

  return createValidationResult(errors.length === 0, errors);
};

// ========================================
// Notification Validation
// ========================================

export const validateNotification = (notification: Partial<Notification>): ValidationResult => {
  const errors: string[] = [];

  // Required fields
  if (!notification.userId?.trim()) {
    errors.push('User ID is required');
  }

  if (!notification.title?.trim()) {
    errors.push('Title is required');
  }

  if (!notification.body?.trim()) {
    errors.push('Body is required');
  }

  if (!notification.type || !Object.values(NOTIFICATION_TYPES).includes(notification.type)) {
    errors.push('Valid notification type is required');
  }

  if (!notification.status || !Object.values(NOTIFICATION_STATUS).includes(notification.status)) {
    errors.push('Valid notification status is required');
  }

  return createValidationResult(errors.length === 0, errors);
};

// ========================================
// Transaction Validation
// ========================================

export const validateTransaction = (transaction: Partial<Transaction>): ValidationResult => {
  const errors: string[] = [];

  // Required fields
  if (!transaction.userId?.trim()) {
    errors.push('User ID is required');
  }

  if (!transaction.type || !Object.values(TRANSACTION_TYPES).includes(transaction.type)) {
    errors.push('Valid transaction type is required');
  }

  if (transaction.amount === undefined || transaction.amount <= 0) {
    errors.push('Transaction amount must be greater than 0');
  }

  if (!transaction.description?.trim()) {
    errors.push('Description is required');
  }

  if (!transaction.status || !Object.values(TRANSACTION_STATUS).includes(transaction.status)) {
    errors.push('Valid transaction status is required');
  }

  return createValidationResult(errors.length === 0, errors);
};

// ========================================
// Validation functions are exported individually above
// ========================================
