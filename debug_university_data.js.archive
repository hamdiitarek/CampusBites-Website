// Manual Firebase data query to debug university filtering issues
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, orderBy } from 'firebase/firestore';

// Firebase config (using same config as the app)
const firebaseConfig = {
  // Note: In production, use environment variables
  apiKey: "AIzaSyDffGwTWoGDsfFODWRBZzB-qNXXYNdEIkE",
  authDomain: "campus-bites-b6288.firebaseapp.com",
  projectId: "campus-bites-b6288",
  storageBucket: "campus-bites-b6288.firebasestorage.app",
  messagingSenderId: "644753463083",
  appId: "1:644753463083:web:4ea15ca3d4b40b19b2b6f7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function debugUniversityData() {
  console.log('🔍 DEBUGGING UNIVERSITY DATA CONSISTENCY');
  console.log('=' .repeat(60));
  
  const universityName = 'Egypt University of Informatics';
  
  try {
    // 1. Get all vendors for this university
    console.log('\n📍 1. FETCHING UNIVERSITY VENDORS...');
    const vendorsQuery = query(
      collection(db, 'vendors'),
      where('universityName', '==', universityName)
    );
    
    const vendorsSnapshot = await getDocs(vendorsQuery);
    const vendors = vendorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const vendorIds = vendors.map(v => v.id);
    
    console.log(`Found ${vendors.length} vendors:`);
    vendors.forEach(vendor => {
      console.log(`- ${vendor.name} (${vendor.id}) - Status: ${vendor.status || 'N/A'}, Approved: ${vendor.isApproved || 'N/A'}`);
    });
    console.log('Vendor IDs:', vendorIds);
    
    // 2. Get ALL orders (no filters first)
    console.log('\n📦 2. FETCHING ALL ORDERS...');
    const allOrdersQuery = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    );
    
    const allOrdersSnapshot = await getDocs(allOrdersQuery);
    const allOrders = allOrdersSnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
    }));
    
    console.log(`Found ${allOrders.length} total orders in database`);
    
    // 3. Filter orders by university vendors
    console.log('\n🔍 3. FILTERING ORDERS BY UNIVERSITY VENDORS...');
    const universityOrders = allOrders.filter(order => vendorIds.includes(order.vendorId));
    
    console.log(`University orders: ${universityOrders.length}`);
    
    // 4. Analyze orders by status
    console.log('\n📊 4. ORDER STATUS BREAKDOWN...');
    const statusCounts = {};
    const statusRevenue = {};
    
    universityOrders.forEach(order => {
      const status = order.status || 'unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
      statusRevenue[status] = (statusRevenue[status] || 0) + (order.total || 0);
    });
    
    console.log('Status breakdown:');
    Object.keys(statusCounts).forEach(status => {
      console.log(`- ${status}: ${statusCounts[status]} orders, EGP ${statusRevenue[status].toFixed(2)} revenue`);
    });
    
    // 5. Calculate metrics exactly like the service should
    console.log('\n💰 5. CALCULATING CORRECT METRICS...');
    
    const totalOrders = universityOrders.length;
    const completedOrders = universityOrders.filter(order => order.status === 'completed');
    const completedOrdersCount = completedOrders.length;
    const completedRevenue = completedOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const allOrdersRevenue = universityOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const avgOrderValue = completedOrdersCount > 0 ? completedRevenue / completedOrdersCount : 0;
    const completionRate = totalOrders > 0 ? (completedOrdersCount / totalOrders) * 100 : 0;
    
    console.log('\n✅ CORRECT METRICS:');
    console.log(`Total Orders: ${totalOrders}`);
    console.log(`Completed Orders: ${completedOrdersCount}`);
    console.log(`Completion Rate: ${completionRate.toFixed(1)}%`);
    console.log(`Total Revenue (All Orders): EGP ${allOrdersRevenue.toFixed(2)}`);
    console.log(`Completed Revenue (Correct): EGP ${completedRevenue.toFixed(2)}`);
    console.log(`Avg Order Value: EGP ${avgOrderValue.toFixed(2)}`);
    
    // 6. Food trends analysis
    console.log('\n🍔 6. FOOD TRENDS ANALYSIS...');
    const itemCounts = {};
    const categoryCounts = {};
    
    // Get vendor data for categories
    const vendorDataMap = {};
    vendors.forEach(vendor => {
      vendorDataMap[vendor.id] = vendor;
    });
    
    universityOrders.forEach(order => {
      const vendorData = vendorDataMap[order.vendorId];
      const defaultCategory = vendorData?.categories?.[0] || 'Main Course';
      
      order.items?.forEach(item => {
        const itemName = item.name;
        const itemCategory = defaultCategory;
        
        if (!itemCounts[itemName]) {
          itemCounts[itemName] = { count: 0, revenue: 0, category: itemCategory };
        }
        itemCounts[itemName].count += item.quantity;
        itemCounts[itemName].revenue += item.price * item.quantity;
        
        categoryCounts[itemCategory] = (categoryCounts[itemCategory] || 0) + item.quantity;
      });
    });
    
    const totalItems = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);
    console.log('\nCategory breakdown:');
    Object.entries(categoryCounts).forEach(([category, count]) => {
      const percentage = totalItems > 0 ? (count / totalItems * 100).toFixed(1) : 0;
      console.log(`- ${category}: ${count} items (${percentage}%)`);
    });
    
    // 7. Show recent orders with details
    console.log('\n📋 7. RECENT ORDERS DETAILS...');
    const recentOrders = universityOrders.slice(0, 10);
    recentOrders.forEach((order, index) => {
      console.log(`${index + 1}. Order ${order.id}:`);
      console.log(`   - Status: ${order.status}`);
      console.log(`   - Total: EGP ${order.total || 0}`);
      console.log(`   - Vendor: ${order.vendorId}`);
      console.log(`   - Created: ${order.createdAt}`);
      console.log(`   - Items: ${order.items?.length || 0} items`);
      console.log('');
    });
    
    // 8. Summary for fixing the service
    console.log('\n🎯 8. SUMMARY FOR SERVICE FIX...');
    console.log(`Expected Dashboard Values:`);
    console.log(`- Total Orders: ${totalOrders}`);
    console.log(`- Completed Orders: ${completedOrdersCount}`);
    console.log(`- Total Revenue (Only Completed): EGP ${completedRevenue.toFixed(2)}`);
    console.log(`- Completion Rate: ${completionRate.toFixed(1)}%`);
    console.log(`- Avg Order Value: EGP ${avgOrderValue.toFixed(2)}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the debug script
debugUniversityData().then(() => {
  console.log('\n✨ Debug complete!');
  process.exit(0);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
