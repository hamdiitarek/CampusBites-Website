# Quick Setup Guide for Testing Phase 2

## Testing the Appwrite Phase 2 Implementation

### 1. Create Test Appwrite Project

1. Go to [Appwrite Cloud](https://cloud.appwrite.io) (or your self-hosted instance)
2. Create a new project
3. Note down your project ID

### 2. Generate API Key

1. In your Appwrite project console, go to **Settings** → **API Keys**
2. Click **Create API Key**
3. Name it "Schema Setup Key"
4. Set expiration as needed
5. Grant permissions:
   - **Database**: Read, Write
   - **Storage**: Read, Write
6. Copy the generated API key

### 3. Configure Environment

1. Copy the example environment file:
   ```bash
   cp .env.appwrite.setup.example .env.local
   ```

2. Update `.env.local` with your values:
   ```env
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-actual-project-id
   APPWRITE_API_KEY=your-actual-api-key
   ```

### 4. Run Phase 2 Setup

1. **Setup the schema**:
   ```bash
   npm run appwrite:setup
   ```

2. **Verify the setup**:
   ```bash
   npm run appwrite:verify
   ```

### 5. Expected Output

**Setup Success**:
```
✅ Appwrite Schema Setup completed successfully!

Next steps:
1. Update your .env.local file with the correct collection IDs
2. Test the setup using the verification script
3. Begin Phase 3: Authentication Migration
```

**Verification Success**:
```
=== SUMMARY ===
✓ Configuration
✓ Database  
✓ Collections
✓ Attributes
✓ Storage

Overall Status: 5/5 checks passed
🎉 Appwrite schema is properly configured!
```

### 6. What Gets Created

**Database**: 
- Name: "Campus Bites Database"
- ID: "main" (configurable)

**Collections** (10 total):
- users, vendors, orders, universities
- complaints, notifications, transactions, reviews
- oneTimeCodes, analytics

**Storage Bucket**:
- Name: "Campus Bites Images" 
- ID: "images"
- Supported: JPG, PNG, GIF, WebP
- Max size: 5MB

### 7. Verify in Appwrite Console

After running the setup, check your Appwrite console:

1. **Database** → Should see "Campus Bites Database"
2. **Collections** → Should see all 10 collections
3. **Storage** → Should see "Campus Bites Images" bucket

### 8. Troubleshooting

**Common Issues**:
- Missing API key → Add to .env.local
- Wrong project ID → Check Appwrite console
- Permission errors → Verify API key permissions
- Rate limiting → Script handles automatically

**Clean Start**:
If you need to start over, delete the database and storage bucket in Appwrite console, then re-run the setup.

### 9. Next Phase

Once verification passes, you're ready for:
- **Phase 3**: Authentication Migration
- **Phase 4**: Data Layer Migration
- **Phase 5**: Testing and Validation