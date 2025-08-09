// Debug script to test UniversityAdminService directly
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration  
const firebaseConfig = {
  apiKey: "AIzaSyBxtC8pV9alKYNITJ4j13Iy3ZI-_j8XS_M",
  authDomain: "campusbites-eg.firebaseapp.com",
  projectId: "campusbites-eg",
  storageBucket: "campusbites-eg.firebasestorage.app",
  messagingSenderId: "970089094387",
  appId: "1:970089094387:web:9a7a6dea9f163ae5a12b86",
  measurementId: "G-YHYJ77SP8M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Mock the UniversityAdminService import (since we can't import ES modules in Node.js easily)
// Copy the exact same logic as in the service

import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  Timestamp
} from 'firebase/firestore';

async function debugUniversityAnalytics() {
  console.log('🔬 DEBUGGING UNIVERSITY ADMIN SERVICE');
  console.log('='.repeat(60));
  
  const universityName = 'Egypt University of Informatics';
  const timeRange = '90d';
  
  try {
    // Replicate exact logic from UniversityAdminService.getUniversityAnalytics
    console.log(`\n⏰ Setting up date range for ${timeRange}...`);
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 90);
    
    console.log(`📅 Date Range: ${startDate.toISOString()} to ${endDate.toISOString()}`);
    
    // Get orders data - exact same query as service
    console.log('\n📦 Querying orders...');
    const ordersQuery = query(
      collection(db, 'orders'),
      where('createdAt', '>=', Timestamp.fromDate(startDate)),
      where('createdAt', '<=', Timestamp.fromDate(endDate)),
      orderBy('createdAt', 'desc')
    );

    const ordersSnapshot = await getDocs(ordersQuery);
    const allOrders = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`📊 Total orders from Firestore: ${allOrders.length}`);
    
    // Get vendors - exact same query as service  
    console.log('\n🏪 Querying vendors...');
    const vendorsQuery = query(
      collection(db, 'vendors'),
      where('universityName', '==', universityName)
    );
    
    const vendorsSnapshot = await getDocs(vendorsQuery);
    const universityVendorIds = vendorsSnapshot.docs.map(doc => doc.id);

    console.log(`🏛️  University: ${universityName}`);
    console.log(`🏪 Found ${universityVendorIds.length} vendors for university:`);
    universityVendorIds.forEach(id => console.log(`   - ${id}`));

    // Filter orders - exact same logic as service
    console.log('\n🔍 Filtering orders by university vendors...');
    const orders = allOrders.filter(order => {
      return universityVendorIds.includes(order.vendorId);
    });

    console.log(`📦 Total orders before university filter: ${allOrders.length}`);
    console.log(`📦 Orders after university filter: ${orders.length}`);
    
    // Show sample orders with vendor IDs
    console.log('\n🔍 Sample orders (first 5):');
    orders.slice(0, 5).forEach((order, i) => {
      console.log(`   ${i+1}. Order ${order.id}: Vendor ${order.vendorId}, Status: ${order.status}, Total: ${order.total}`);
    });
    
    // Calculate analytics - exact same logic as service
    console.log('\n💰 Calculating analytics...');
    const totalOrders = orders.length;
    const completedOrders = orders.filter(order => order.status === 'completed');
    const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    
    console.log(`📦 Completed orders for analytics: ${completedOrders.length}`);
    console.log(`💰 Total revenue: EGP ${totalRevenue}`);
    
    const averageOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;
    console.log(`📊 Average order value: EGP ${averageOrderValue}`);
    
    // Check unique students and vendors
    const uniqueStudents = new Set(orders.map(order => order.userId)).size;
    const uniqueVendors = universityVendorIds.length;
    
    console.log(`👥 Unique students: ${uniqueStudents}`);
    console.log(`🏪 Unique vendors: ${uniqueVendors}`);
    
    // Status breakdown
    console.log('\n📊 Order status breakdown:');
    const statusCounts = {};
    orders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });
    
    Object.entries(statusCounts).forEach(([status, count]) => {
      const percentage = Math.round((count / orders.length) * 100);
      console.log(`   ${status}: ${count} (${percentage}%)`);
    });
    
    // Check for orders without vendorId or with invalid vendorId
    console.log('\n🔍 Data quality checks:');
    const ordersWithoutVendor = allOrders.filter(order => !order.vendorId);
    const ordersWithInvalidVendor = allOrders.filter(order => 
      order.vendorId && !universityVendorIds.includes(order.vendorId)
    );
    
    console.log(`❓ Orders without vendorId: ${ordersWithoutVendor.length}`);
    console.log(`❓ Orders with non-university vendorId: ${ordersWithInvalidVendor.length}`);
    
    if (ordersWithInvalidVendor.length > 0) {
      console.log('🔍 Non-university vendor IDs found in orders:');
      const nonUniVendorIds = new Set(ordersWithInvalidVendor.map(o => o.vendorId));
      nonUniVendorIds.forEach(id => console.log(`   - ${id}`));
    }
    
    // Expected results summary
    console.log('\n🎯 EXPECTED DASHBOARD RESULTS:');
    console.log('='.repeat(40));
    console.log(`Total Orders: ${totalOrders}`);
    console.log(`Completed Orders: ${completedOrders.length}`);
    console.log(`Completion Rate: ${Math.round((completedOrders.length / totalOrders) * 100)}%`);
    console.log(`Total Revenue: EGP ${totalRevenue.toFixed(2)}`);
    console.log(`Average Order Value: EGP ${averageOrderValue.toFixed(2)}`);
    
    // Compare with actual dashboard results
    console.log('\n🔍 DASHBOARD COMPARISON:');
    console.log('Expected vs Actual:');
    console.log(`Completed Orders: ${completedOrders.length} vs 42`);
    console.log(`Total Revenue: EGP ${totalRevenue.toFixed(2)} vs EGP 8,417.00`);
    console.log(`Completion Rate: ${Math.round((completedOrders.length / totalOrders) * 100)}% vs 85.7%`);
    
    if (completedOrders.length !== 42) {
      console.log('\n⚠️  MISMATCH DETECTED!');
      console.log('Possible causes:');
      console.log('1. Dashboard using different date range');
      console.log('2. Dashboard has additional filters');
      console.log('3. Dashboard query has limits');
      console.log('4. Caching issues');
      console.log('5. Different university filtering logic');
    }
    
  } catch (error) {
    console.error('❌ Error debugging analytics:', error);
  }
  
  process.exit(0);
}

// Run the debug
debugUniversityAnalytics().catch(console.error);
