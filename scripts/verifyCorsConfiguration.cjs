#!/usr/bin/env node
/**
 * Appwrite CORS Configuration Verification Script
 * 
 * This script helps verify that your Appwrite project is properly configured
 * for your production domain and checks for common CORS-related issues.
 */

const https = require('https');

// Try to load dotenv, but don't fail if it's not available
let dotenv;
try {
  dotenv = require('dotenv');
  // Load environment variables if dotenv is available
  try {
    dotenv.config({ path: '.env.local' });
    dotenv.config({ path: '.env.prod' });
  } catch (e) {
    // Environment files don't exist, which is fine
  }
} catch (e) {
  console.log('Note: dotenv not available, using process.env directly');
}

const config = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://www.campusbites.app',
};

console.log('🔍 Appwrite CORS Configuration Verification');
console.log('==========================================\n');

// Validate configuration
function validateConfig() {
  console.log('📋 Configuration Check:');
  console.log(`   Endpoint: ${config.endpoint}`);
  console.log(`   Project ID: ${config.projectId || '❌ MISSING'}`);
  console.log(`   App URL: ${config.appUrl}`);
  console.log('');

  const issues = [];
  
  if (!config.projectId) {
    issues.push('❌ NEXT_PUBLIC_APPWRITE_PROJECT_ID is not set');
  }
  
  if (config.appUrl.includes('localhost')) {
    issues.push('⚠️  App URL still points to localhost');
  }
  
  if (!config.appUrl.startsWith('https://') && !config.appUrl.includes('localhost')) {
    issues.push('⚠️  Production URL should use HTTPS');
  }

  if (issues.length > 0) {
    console.log('🚨 Configuration Issues Found:');
    issues.forEach(issue => console.log(`   ${issue}`));
    console.log('');
  } else {
    console.log('✅ Configuration looks good!\n');
  }

  return issues.length === 0;
}

// Test Appwrite API connectivity
function testAppwriteAPI() {
  return new Promise((resolve) => {
    console.log('🌐 Testing Appwrite API connectivity...');
    
    const options = {
      hostname: 'cloud.appwrite.io',
      port: 443,
      path: '/v1/health',
      method: 'GET',
      headers: {
        'X-Appwrite-Project': config.projectId || 'test',
        'Origin': config.appUrl,
        'User-Agent': 'CampusBites-CORS-Checker/1.0'
      }
    };

    const req = https.request(options, (res) => {
      console.log(`   Status: ${res.statusCode}`);
      console.log(`   CORS Headers:`);
      
      const corsHeaders = {
        'Access-Control-Allow-Origin': res.headers['access-control-allow-origin'],
        'Access-Control-Allow-Methods': res.headers['access-control-allow-methods'],
        'Access-Control-Allow-Headers': res.headers['access-control-allow-headers'],
      };
      
      Object.entries(corsHeaders).forEach(([key, value]) => {
        if (value) {
          console.log(`     ${key}: ${value}`);
        }
      });
      
      // Check if origin is allowed
      const allowedOrigin = res.headers['access-control-allow-origin'];
      if (allowedOrigin === config.appUrl || allowedOrigin === '*') {
        console.log('   ✅ Origin is allowed');
      } else if (allowedOrigin === 'https://localhost' || allowedOrigin?.includes('localhost')) {
        console.log('   ❌ CORS configured for localhost instead of production domain');
        console.log('   🔧 Fix: Update platform hostname in Appwrite console');
      } else {
        console.log(`   ⚠️  Origin might not be allowed. Expected: ${config.appUrl}, Got: ${allowedOrigin}`);
      }
      
      console.log('');
      resolve(res.statusCode === 200);
    });

    req.on('error', (err) => {
      console.log(`   ❌ Connection failed: ${err.message}`);
      console.log('');
      resolve(false);
    });

    req.setTimeout(10000, () => {
      console.log('   ❌ Request timeout');
      console.log('');
      resolve(false);
    });

    req.end();
  });
}

// Test authentication endpoint
function testAuthEndpoint() {
  return new Promise((resolve) => {
    console.log('🔐 Testing authentication endpoint...');
    
    const options = {
      hostname: 'cloud.appwrite.io',
      port: 443,
      path: '/v1/account/sessions/current',
      method: 'GET',
      headers: {
        'X-Appwrite-Project': config.projectId || 'test',
        'Origin': config.appUrl,
        'User-Agent': 'CampusBites-CORS-Checker/1.0'
      }
    };

    const req = https.request(options, (res) => {
      console.log(`   Status: ${res.statusCode}`);
      
      const allowedOrigin = res.headers['access-control-allow-origin'];
      if (res.statusCode === 401) {
        console.log('   ✅ Endpoint accessible (401 = no session, which is expected)');
      } else if (res.statusCode === 403) {
        console.log('   ❌ Forbidden - check project ID and platform configuration');
      }
      
      if (allowedOrigin === config.appUrl || allowedOrigin === '*') {
        console.log('   ✅ CORS headers correct for this endpoint');
      } else if (allowedOrigin?.includes('localhost')) {
        console.log('   ❌ CORS still configured for localhost');
      }
      
      console.log('');
      resolve(res.statusCode !== 403);
    });

    req.on('error', (err) => {
      console.log(`   ❌ Connection failed: ${err.message}`);
      console.log('');
      resolve(false);
    });

    req.setTimeout(10000, () => {
      console.log('   ❌ Request timeout');
      console.log('');
      resolve(false);
    });

    req.end();
  });
}

// Generate recommendations
function generateRecommendations(configOk, apiOk, authOk) {
  console.log('💡 Recommendations:');
  console.log('==================');
  
  if (!configOk) {
    console.log('1. ⚙️  Fix environment variables:');
    console.log('   - Set NEXT_PUBLIC_APPWRITE_PROJECT_ID');
    console.log('   - Ensure NEXT_PUBLIC_APP_URL uses production domain');
    console.log('   - Use HTTPS for production URLs');
    console.log('');
  }
  
  if (!apiOk || !authOk) {
    console.log('2. 🌐 Fix Appwrite platform configuration:');
    console.log('   - Go to Appwrite Console > Settings > Platforms');
    console.log('   - Add/edit Web platform with hostname: www.campusbites.app');
    console.log('   - Remove or disable localhost platforms for production');
    console.log('   - Ensure hostname matches exactly (with/without www)');
    console.log('');
  }
  
  if (configOk && apiOk && authOk) {
    console.log('✅ Everything looks good!');
    console.log('   Your Appwrite configuration should work correctly.');
    console.log('');
  }
  
  console.log('3. 🔄 After making changes:');
  console.log('   - Clear browser cache and cookies');
  console.log('   - Redeploy your application');
  console.log('   - Test authentication flow');
  console.log('   - Run this script again to verify');
  console.log('');
  
  console.log('📚 For detailed instructions, see: APPWRITE_PRODUCTION_SETUP.md');
}

// Main execution
async function main() {
  const configOk = validateConfig();
  const apiOk = await testAppwriteAPI();
  const authOk = await testAuthEndpoint();
  
  generateRecommendations(configOk, apiOk, authOk);
  
  console.log('🏁 Verification Complete');
  console.log('========================');
  
  if (configOk && apiOk && authOk) {
    console.log('✅ All checks passed! Your CORS configuration should work.');
    process.exit(0);
  } else {
    console.log('❌ Issues found. Please fix the configuration and run again.');
    process.exit(1);
  }
}

// Handle errors
process.on('unhandledRejection', (err) => {
  console.error('❌ Unexpected error:', err.message);
  process.exit(1);
});

if (require.main === module) {
  main();
}

module.exports = { validateConfig, testAppwriteAPI, testAuthEndpoint };