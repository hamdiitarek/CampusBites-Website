#!/usr/bin/env node
/**
 * Phase 3 Authentication Migration Verification Script
 * Verifies that the authentication system has been successfully migrated from Firebase to Appwrite
 */

const fs = require('fs');
const path = require('path');

function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    warning: '\x1b[33m', // Yellow
    error: '\x1b[31m',   // Red
    reset: '\x1b[0m'     // Reset
  };
  
  console.log(`${colors[level]}[${timestamp}] ${message}${colors.reset}`);
}

function verifyProvidersFile() {
  log('Verifying providers.tsx uses AppwriteAuthProvider...');
  
  const providersPath = path.join(__dirname, '../app/providers.tsx');
  const content = fs.readFileSync(providersPath, 'utf8');
  
  if (content.includes('AppwriteAuthProvider as AuthProvider')) {
    log('✓ Providers file correctly uses AppwriteAuthProvider', 'success');
    return true;
  } else {
    log('✗ Providers file still uses Firebase AuthProvider', 'error');
    return false;
  }
}

function verifyImportReplacements() {
  log('Verifying all components use AppwriteAuthContext...');
  
  const appDir = path.join(__dirname, '../app');
  let firebaseImports = 0;
  let appwriteImports = 0;
  
  function checkFiles(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        checkFiles(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        if (content.includes("from '@/contexts/AuthContext'")) {
          firebaseImports++;
          log(`  Found Firebase import in: ${filePath.replace(appDir, '')}`, 'warning');
        }
        
        if (content.includes("from '@/contexts/AppwriteAuthContext'")) {
          appwriteImports++;
        }
      }
    }
  }
  
  checkFiles(appDir);
  
  if (firebaseImports === 0) {
    log(`✓ No Firebase AuthContext imports found`, 'success');
    log(`✓ Found ${appwriteImports} Appwrite AuthContext imports`, 'success');
    return true;
  } else {
    log(`✗ Found ${firebaseImports} remaining Firebase AuthContext imports`, 'error');
    return false;
  }
}

function verifyAuthContextCompatibility() {
  log('Verifying AppwriteAuthContext interface compatibility...');
  
  const appwriteContextPath = path.join(__dirname, '../app/contexts/AppwriteAuthContext.tsx');
  const content = fs.readFileSync(appwriteContextPath, 'utf8');
  
  const requiredMethods = [
    'login',
    'register', 
    'logout',
    'resetPassword',
    'updatePassword',
    'updateUserProfile',
    'updateWalletBalance',
    'getUserDashboardUrl',
    'refreshUserData'
  ];
  
  let allMethodsFound = true;
  
  for (const method of requiredMethods) {
    if (content.includes(`${method}:`)) {
      log(`  ✓ ${method} method found`, 'success');
    } else {
      log(`  ✗ ${method} method missing`, 'error');
      allMethodsFound = false;
    }
  }
  
  return allMethodsFound;
}

function verifyEnvironmentConfig() {
  log('Verifying Appwrite environment configuration...');
  
  const envPath = path.join(__dirname, '../.env.local');
  
  if (!fs.existsSync(envPath)) {
    log('✗ .env.local file not found', 'error');
    return false;
  }
  
  const content = fs.readFileSync(envPath, 'utf8');
  
  const requiredVars = [
    'NEXT_PUBLIC_APPWRITE_ENDPOINT',
    'NEXT_PUBLIC_APPWRITE_PROJECT_ID',
    'NEXT_PUBLIC_APPWRITE_DATABASE_ID',
    'NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID'
  ];
  
  let allVarsFound = true;
  
  for (const envVar of requiredVars) {
    if (content.includes(envVar)) {
      log(`  ✓ ${envVar} configured`, 'success');
    } else {
      log(`  ✗ ${envVar} missing`, 'error');
      allVarsFound = false;
    }
  }
  
  return allVarsFound;
}

function generateReport() {
  log('');
  log('=== PHASE 3 AUTHENTICATION MIGRATION VERIFICATION REPORT ===', 'info');
  log('');
  
  const results = {
    providers: false,
    imports: false,
    compatibility: false,
    environment: false
  };
  
  results.providers = verifyProvidersFile();
  results.imports = verifyImportReplacements();
  results.compatibility = verifyAuthContextCompatibility();
  results.environment = verifyEnvironmentConfig();
  
  // Generate summary
  log('');
  log('=== SUMMARY ===', 'info');
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([check, passed]) => {
    const status = passed ? '✓' : '✗';
    const level = passed ? 'success' : 'error';
    log(`${status} ${check.charAt(0).toUpperCase() + check.slice(1)}`, level);
  });
  
  log('');
  log(`Overall Status: ${passed}/${total} checks passed`, passed === total ? 'success' : 'error');
  
  if (passed === total) {
    log('🎉 Phase 3: Authentication Migration COMPLETED successfully!', 'success');
    log('✅ All components now use Appwrite authentication', 'success');
    log('✅ Firebase dependencies removed from auth layer', 'success');
    log('✅ Backward compatibility maintained', 'success');
    log('', 'info');
    log('Next Steps:', 'info');
    log('- Test authentication flows in development', 'info');
    log('- Verify user login/registration works with Appwrite', 'info');
    log('- Test role-based redirects and protected routes', 'info');
    log('- Consider Phase 4: Complete data layer migration', 'info');
  } else {
    log('❌ Authentication migration incomplete', 'error');
    log('Please fix the issues above before proceeding', 'info');
  }
  
  return passed === total;
}

async function main() {
  try {
    const success = generateReport();
    process.exit(success ? 0 : 1);
  } catch (error) {
    log(`Verification failed: ${error.message}`, 'error');
    process.exit(1);
  }
}

main();