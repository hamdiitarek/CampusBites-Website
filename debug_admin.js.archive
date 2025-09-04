// Debug script using Firebase Admin SDK
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import path from 'path';

// Initialize Firebase Admin
const serviceAccountPath = './firebase-service-account.json';
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'campus-bites-b6288'
});

const db = admin.firestore();

async function debugUniversityData() {
  console.log('🔍 DEBUGGING UNIVERSITY DATA CONSISTENCY');
  console.log('=' .repeat(60));
  
  const universityName = 'Egypt University of Informatics';
  
  try {
    // 1. Get all vendors for this university
    console.log('\n📍 1. FETCHING UNIVERSITY VENDORS...');
    const vendorsRef = db.collection('vendors');
    const vendorsQuery = vendorsRef.where('universityName', '==', universityName);
    
    const vendorsSnapshot = await vendorsQuery.get();
    const vendors = vendorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const vendorIds = vendors.map(v => v.id);
    
    console.log(`Found ${vendors.length} vendors:`);
    vendors.forEach(vendor => {
      console.log(`- ${vendor.name} (${vendor.id}) - Status: ${vendor.status || 'N/A'}, Approved: ${vendor.isApproved || 'N/A'}`);
    });
    console.log('Vendor IDs:', vendorIds);
    
    // 2. Get ALL orders (no filters first)
    console.log('\n📦 2. FETCHING ALL ORDERS...');
    const allOrdersRef = db.collection('orders');
    const allOrdersQuery = allOrdersRef.orderBy('createdAt', 'desc').limit(100); // Limit to recent orders
    
    const allOrdersSnapshot = await allOrdersQuery.get();
    const allOrders = allOrdersSnapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id, 
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        total: parseFloat(data.total) || 0
      };
    });
    
    console.log(`Found ${allOrders.length} total orders in database (recent 100)`);
    
    // Show all orders with their vendor IDs
    console.log('\nAll orders vendor mapping:');
    const vendorOrderCounts = {};
    allOrders.forEach(order => {
      const vendorId = order.vendorId;
      vendorOrderCounts[vendorId] = (vendorOrderCounts[vendorId] || 0) + 1;
      const vendorName = vendors.find(v => v.id === vendorId)?.name || 'Unknown Vendor';
      console.log(`Order ${order.id}: Vendor ${vendorId} (${vendorName}) - Status: ${order.status} - Total: EGP ${order.total}`);
    });
    
    console.log('\nVendor order counts:');
    Object.entries(vendorOrderCounts).forEach(([vendorId, count]) => {
      const vendorName = vendors.find(v => v.id === vendorId)?.name || 'Unknown Vendor';
      const isUniversityVendor = vendorIds.includes(vendorId);
      console.log(`- ${vendorName} (${vendorId}): ${count} orders ${isUniversityVendor ? '[UNIVERSITY VENDOR]' : '[OTHER UNIVERSITY]'}`);
    });
    
    // 3. Filter orders by university vendors
    console.log('\n🔍 3. FILTERING ORDERS BY UNIVERSITY VENDORS...');
    const universityOrders = allOrders.filter(order => vendorIds.includes(order.vendorId));
    
    console.log(`University orders: ${universityOrders.length}`);
    
    if (universityOrders.length > 0) {
      console.log('\nUniversity orders details:');
      universityOrders.forEach((order, index) => {
        const vendor = vendors.find(v => v.id === order.vendorId);
        console.log(`${index + 1}. Order ${order.id}:`);
        console.log(`   - Vendor: ${vendor?.name || 'Unknown'} (${order.vendorId})`);
        console.log(`   - Status: ${order.status}`);
        console.log(`   - Total: EGP ${order.total}`);
        console.log(`   - Items: ${order.items?.length || 0}`);
        console.log(`   - Created: ${order.createdAt}`);
        console.log('');
      });
    }
    
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
    
    let totalRevenue = 0;
    universityOrders.forEach(order => {
      const vendorData = vendorDataMap[order.vendorId];
      const defaultCategory = vendorData?.categories?.[0] || 'Main Course';
      
      order.items?.forEach(item => {
        const itemName = item.name;
        const itemCategory = defaultCategory;
        const itemRevenue = (item.price || 0) * (item.quantity || 0);
        
        if (!itemCounts[itemName]) {
          itemCounts[itemName] = { count: 0, revenue: 0, category: itemCategory };
        }
        itemCounts[itemName].count += item.quantity || 0;
        itemCounts[itemName].revenue += itemRevenue;
        
        categoryCounts[itemCategory] = (categoryCounts[itemCategory] || 0) + (item.quantity || 0);
        totalRevenue += itemRevenue;
      });
    });
    
    console.log(`Total revenue from items calculation: EGP ${totalRevenue.toFixed(2)}`);
    
    const totalItems = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);
    console.log('\nCategory breakdown:');
    Object.entries(categoryCounts).forEach(([category, count]) => {
      const percentage = totalItems > 0 ? (count / totalItems * 100).toFixed(1) : 0;
      console.log(`- ${category}: ${count} items (${percentage}%)`);
    });
    
    // 7. Compare with dashboard inconsistency
    console.log('\n🎯 7. DASHBOARD INCONSISTENCY ANALYSIS...');
    console.log('Dashboard shows:');
    console.log('- University Performance: EGP 1,477.97 (13 completed orders)');
    console.log('- Total Revenue section: EGP 2,169 (9 total orders)');
    console.log('- Category breakdown: EGP 7,508 total');
    console.log('');
    console.log('Actual Firebase data:');
    console.log(`- Total Orders: ${totalOrders}`);
    console.log(`- Completed Orders: ${completedOrdersCount}`);
    console.log(`- Completed Revenue: EGP ${completedRevenue.toFixed(2)}`);
    console.log(`- All Orders Revenue: EGP ${allOrdersRevenue.toFixed(2)}`);
    console.log(`- Items Revenue: EGP ${totalRevenue.toFixed(2)}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  // Gracefully close the admin app
  await admin.app().delete();
}

// Run the debug script
debugUniversityData().then(() => {
  console.log('\n✨ Debug complete!');
  process.exit(0);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
