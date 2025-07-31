# Firebase Setup Guide

This application now uses Firebase for authentication and data storage with role-based access control.

## 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing one: campusbites-eg)
3. Enable Authentication with Email/Password provider
4. Enable Firestore Database
5. Set up Firestore security rules (see below)

## 2. Environment Configuration

The Firebase configuration is already set up in `app/lib/firebase.ts` with the following config:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBxtC8pV9alKYNITJ4j13Iy3ZI-_j8XS_M",
  authDomain: "campusbites-eg.firebaseapp.com",
  projectId: "campusbites-eg",
  storageBucket: "campusbites-eg.firebasestorage.app",
  messagingSenderId: "970089094387",
  appId: "1:970089094387:web:9a7a6dea9f163ae5a12b86",
  measurementId: "G-YHYJ77SP8M"
};
```

## 3. Firestore Security Rules

Set up the following security rules in Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read user documents for role checking
    match /users/{userId} {
      allow read: if request.auth != null;
    }
  }
}
```

## 4. User Roles

The application supports three user roles:
- **Student**: Access to student dashboard and features
- **Vendor**: Access to vendor dashboard and menu management
- **Admin**: Access to admin dashboard with full control

User roles are stored in Firestore under `/users/{userId}` with the following structure:
```json
{
  "email": "user@example.com",
  "name": "User Name",
  "role": "student|vendor|admin",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## 5. Authentication Flow

1. **Registration**: Users register with email/password and select a role
2. **Login**: Email/password authentication
3. **Role-based Routing**: Users are redirected to appropriate dashboards based on their role
4. **Password Reset**: Firebase handles password reset emails

## 6. Development Setup

1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Access the application at `http://localhost:3000`

## 7. Available Routes

### Authentication Routes
- `/en/login` - English login page
- `/ar/login` - Arabic login page
- `/en/signup` - English signup page
- `/ar/signup` - Arabic signup page
- `/en/forgot-password` - English password reset
- `/ar/forgot-password` - Arabic password reset

### Dashboard Routes
- `/en/student-dashboard` - Student dashboard (English)
- `/ar/student-dashboard` - Student dashboard (Arabic)
- `/en/vendor-dashboard` - Vendor dashboard (English)
- `/ar/vendor-dashboard` - Vendor dashboard (Arabic)
- `/en/admin-dashboard` - Admin dashboard (English)
- `/ar/admin-dashboard` - Admin dashboard (Arabic)

## 8. Features

- ✅ **Role-based Authentication**: Student, Vendor, Admin roles
- ✅ **Bilingual Support**: Arabic (RTL) and English (LTR)
- ✅ **Responsive Design**: Mobile-first approach
- ✅ **Real-time Auth State**: Firebase onAuthStateChanged
- ✅ **Password Reset**: Firebase password reset emails
- ✅ **Secure Storage**: User data and roles in Firestore
- ✅ **Role-based Routing**: Automatic redirection based on user role

## Troubleshooting

1. **Authentication Issues**: Check Firebase console for authentication settings
2. **Firestore Access**: Ensure security rules are properly configured
3. **Environment**: Verify Firebase configuration matches your project
4. **Roles**: Check user document in Firestore for proper role assignment
