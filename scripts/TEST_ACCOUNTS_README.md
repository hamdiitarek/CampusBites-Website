# Test Account Creation Script

This script creates test user accounts for authentication testing in the CampusBites application.

## Prerequisites

1. **Environment Setup**: Ensure you have the following environment variables in your `.env.local` file:
   ```bash
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_APPWRITE_DATABASE_ID=main
   APPWRITE_API_KEY=your-server-api-key
   NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=users
   ```

2. **API Key Permissions**: Your `APPWRITE_API_KEY` must have the following permissions:
   - `users.read`
   - `users.write`
   - `databases.read`
   - `databases.write`

## Usage

### Create All Test Accounts
```bash
npm run test:accounts
```

### Create Accounts by Role
```bash
npm run test:accounts:student      # Create student accounts only
npm run test:accounts:vendor       # Create vendor accounts only
npm run test:accounts:admin        # Create admin accounts only
npm run test:accounts:super-admin  # Create super admin accounts only
```

### View Account Information
```bash
npm run test:accounts:info
```

### Clean Up Test Accounts
```bash
npm run test:accounts:clean
```

### Direct Script Usage
```bash
node scripts/createTestAccounts.js --help        # Show help
node scripts/createTestAccounts.js               # Create all accounts
node scripts/createTestAccounts.js --role student
node scripts/createTestAccounts.js --clean
node scripts/createTestAccounts.js --info
```

## Test Accounts Created

### Student Accounts (3)
- **Ahmed Hassan**
  - Email: `ahmed.student@test.campusbites.com`
  - Password: `TestStudent123!`
  - Wallet Balance: $100

- **Fatma Ali**
  - Email: `fatma.student@test.campusbites.com`
  - Password: `TestStudent123!`
  - Wallet Balance: $50

- **Omar Mahmoud**
  - Email: `omar.student@test.campusbites.com`
  - Password: `TestStudent123!`
  - Wallet Balance: $75

### Vendor Accounts (2)
- **Mohamed Café Owner**
  - Email: `mohamed.vendor@test.campusbites.com`
  - Password: `TestVendor123!`

- **Sarah Restaurant Manager**
  - Email: `sarah.vendor@test.campusbites.com`
  - Password: `TestVendor123!`

### Admin Account (1)
- **Khalid University Admin**
  - Email: `khalid.admin@test.campusbites.com`
  - Password: `TestAdmin123!`

### Super Admin Account (1)
- **Hamdi Super Admin**
  - Email: `hamdi.superadmin@test.campusbites.com`
  - Password: `TestSuperAdmin123!`

## Login URLs

- **English Interface**: `http://localhost:3000/en/login`
- **Arabic Interface**: `http://localhost:3000/ar/login`

## Features

- ✅ Creates both Appwrite user accounts and database documents
- ✅ Supports role-based account creation
- ✅ Handles duplicate account detection
- ✅ Includes cleanup functionality
- ✅ Comprehensive error handling
- ✅ Proper validation of environment variables
- ✅ Detailed logging and progress reporting

## Troubleshooting

### Common Issues

1. **Missing API Key**
   ```
   Error: APPWRITE_API_KEY is required
   ```
   Solution: Add your Appwrite server API key to `.env.local`

2. **Permission Denied**
   ```
   Error: Missing scope: users.write
   ```
   Solution: Update your API key permissions in Appwrite Console

3. **User Already Exists**
   ```
   ⚠️ User already exists: email@domain.com
   ```
   Solution: This is normal - the script skips existing accounts

4. **Database Collection Not Found**
   ```
   Error: Collection 'users' not found
   ```
   Solution: Run `npm run appwrite:setup` to create the database schema

### Reset Everything
If you need to completely reset the test accounts:
```bash
npm run test:accounts:clean
npm run test:accounts
```

## Security Notes

- Test accounts use the domain `@test.campusbites.com` for easy identification
- All test passwords follow a secure pattern with uppercase, lowercase, numbers, and symbols
- The script only creates accounts in development/testing environments
- Clean up test accounts before deploying to production

## Integration with Development Workflow

1. **Initial Setup**: Run after setting up your Appwrite database
2. **Daily Development**: Use specific role accounts for testing features
3. **Feature Testing**: Create additional accounts for specific test scenarios
4. **CI/CD**: Include in testing pipelines for automated auth testing
