// Test script to verify the dashboard fix will work
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  Timestamp,
  limit
} from 'firebase/firestore';

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

async function testDashboardFix() {
  console.log('🔧 TESTING DASHBOARD FIX');
  console.log('='.repeat(50));
  
  const universityName = 'Egypt University of Informatics';
  const limitCount = 1000; // New limit we're using
  
  try {
    console.log(`📊 Testing with limit: ${limitCount}`);
    
    // Get university vendors (same as service)
    console.log('\n🏪 Getting university vendors...');
    const vendorsQuery = query(
      collection(db, 'vendors'),
      where('universityName', '==', universityName)
    );
    
    const vendorsSnapshot = await getDocs(vendorsQuery);
    const universityVendorIds = vendorsSnapshot.docs.map(doc => doc.id);
    console.log(`🏪 Found ${universityVendorIds.length} vendors for university`);

    // Simulate the getRecentOrders query with higher limit
    console.log('\n📦 Testing getRecentOrders with higher limit...');
    const ordersQuery = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc'),
      limit(limitCount * 2) // Same multiplier as service
    );

    const ordersSnapshot = await getDocs(ordersQuery);
    const allOrders = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`📊 Total orders from Firestore query: ${allOrders.length}`);
    
    // Filter by university vendors (same logic as service)
    const universityOrders = allOrders
      .filter(order => {
        return universityVendorIds.includes(order.vendorId);
      })
      .slice(0, limitCount); // Same slice as service
      
    console.log(`📦 University orders after filtering: ${universityOrders.length}`);
    
    // Calculate what the dashboard should show
    const completedOrders = universityOrders.filter(order => order.status === 'completed');
    const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    
    console.log('\n🎯 EXPECTED DASHBOARD RESULTS WITH FIX:');
    console.log('='.repeat(40));
    console.log(`Total Orders: ${universityOrders.length}`);
    console.log(`Completed Orders: ${completedOrders.length}`);
    console.log(`Completion Rate: ${Math.round((completedOrders.length / universityOrders.length) * 100)}%`);
    console.log(`Total Revenue: EGP ${totalRevenue.toFixed(2)}`);
    
    // Compare with previous results
    console.log('\n📊 BEFORE vs AFTER COMPARISON:');
    console.log(`Orders: 42 → ${completedOrders.length} (${completedOrders.length > 42 ? '✅ FIXED!' : '❌ Still broken'})`);
    console.log(`Revenue: EGP 8,417 → EGP ${totalRevenue.toFixed(2)} (${totalRevenue > 8417 ? '✅ FIXED!' : '❌ Still broken'})`);
    
    if (completedOrders.length >= 600) {
      console.log('\n🎉 SUCCESS! The fix should work perfectly!');
      console.log('   - Dashboard will now see all 674 completed orders');
      console.log('   - Revenue will show the correct ~EGP 131,656');
      console.log('   - Completion rate will match the 86% from our demo data');
    } else if (completedOrders.length > 42) {
      console.log('\n✅ PARTIAL SUCCESS! Much better than before');
      console.log('   - Still not all orders, but major improvement');
      console.log('   - May need even higher limit or check date filtering');
    } else {
      console.log('\n❌ ISSUE PERSISTS!');
      console.log('   - Need to investigate further');
      console.log('   - Check if vendor filtering is working correctly');
    }
    
  } catch (error) {
    console.error('❌ Error testing fix:', error);
  }
  
  process.exit(0);
}

testDashboardFix().catch(console.error);
