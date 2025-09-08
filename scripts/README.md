# Appwrite Scripts

This directory contains scripts for managing the Appwrite backend services.

## 🚀 Available Scripts

### Database Setup
- `setupAppwriteSchema.cjs` - Set up Appwrite database collections and attributes
- `verifyAppwriteSchema.cjs` - Verify the database schema is properly configured

### Demo Data
- `setup_demo_data_appwrite.cjs` - Create demo data for testing
- `test_appwrite_integration.cjs` - Test Appwrite integration and connections

### Authentication & Configuration
- `verifyAuthMigration.cjs` - Verify authentication migration is complete
- `verifyCorsConfiguration.cjs` - Verify CORS configuration

## 📋 Quick Start

### Prerequisites
```bash
npm install node-appwrite
```

### Environment Configuration
Copy `.env.appwrite.example` to `.env.local` and configure your Appwrite settings.

### Run Scripts
```bash
# Set up database schema
npm run appwrite:setup

# Verify schema
npm run appwrite:verify

# Test integration
npm run appwrite:test

# Set up demo data
npm run appwrite:demo

# Clean demo data
npm run appwrite:demo-clean
```

## 📞 Support

For Appwrite-related issues, refer to the [Appwrite documentation](https://appwrite.io/docs) or check the migration guides in the root directory.