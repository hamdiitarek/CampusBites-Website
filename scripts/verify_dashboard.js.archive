// Comprehensive Dashboard Verification Script
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';

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

const UNIVERSITY_NAME = 'Egypt University of Informatics';

async function verifyDashboard() {
  console.log('🔍 COMPREHENSIVE DASHBOARD VERIFICATION');
  console.log('='.repeat(70));
  
  try {
    // 1. Verify University Data
    console.log('\n🏛️  1. UNIVERSITY VERIFICATION:');
    const universitiesSnapshot = await getDocs(collection(db, 'universities'));
    const universities = universitiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const targetUniversity = universities.find(u => u.name === UNIVERSITY_NAME);
    
    if (targetUniversity) {
      console.log(`✅ University Found: ${targetUniversity.name}`);
      console.log(`   ID: ${targetUniversity.id}`);
      console.log(`   Domain: ${targetUniversity.emailDomain || 'students.eui.edu.eg'}`);
    } else {
      console.log(`❌ University "${UNIVERSITY_NAME}" not found!`);
      return;
    }
    
    // 2. Verify Users by Role
    console.log('\n👥 2. USER VERIFICATION:');
    const usersQuery = query(
      collection(db, 'users'),
      where('universityName', '==', UNIVERSITY_NAME)
    );
    const usersSnapshot = await getDocs(usersQuery);
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const students = users.filter(u => u.role === 'student');
    const vendors = users.filter(u => u.role === 'vendor');
    const admins = users.filter(u => u.role === 'admin');
    
    console.log(`✅ Total Users: ${users.length}`);
    console.log(`   📚 Students: ${students.length}`);
    console.log(`   🏪 Vendor Accounts: ${vendors.length}`);
    console.log(`   👑 Admins: ${admins.length}`);
    
    // 3. Verify Vendors
    console.log('\n🏪 3. VENDOR VERIFICATION:');
    const vendorsQuery = query(
      collection(db, 'vendors'),
      where('universityName', '==', UNIVERSITY_NAME)
    );
    const vendorsSnapshot = await getDocs(vendorsQuery);
    const vendorBusinesses = vendorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const vendorIds = vendorBusinesses.map(v => v.id);
    
    console.log(`✅ Total Vendor Businesses: ${vendorBusinesses.length}`);
    console.log(`   🟢 Open: ${vendorBusinesses.filter(v => v.isOpen).length}`);
    console.log(`   ✅ Approved: ${vendorBusinesses.filter(v => v.isApproved).length}`);
    console.log(`   🚫 Suspended: ${vendorBusinesses.filter(v => v.isSuspended).length}`);
    
    // List active vendors with menus
    console.log('\n📋 Active Vendors with Menus:');
    for (const vendor of vendorBusinesses.filter(v => v.isOpen && v.isApproved && !v.isSuspended)) {
      console.log(`   🏪 ${vendor.name} (${vendor.id})`);
      
      // Check vendor menu
      try {
        const menuSnapshot = await getDocs(collection(db, 'vendors', vendor.id, 'menu'));
        if (menuSnapshot.size > 0) {
          let totalMenuItems = 0;
          menuSnapshot.docs.forEach(menuDoc => {
            const menuData = menuDoc.data();
            Object.keys(menuData).forEach(categoryKey => {
              const category = menuData[categoryKey];
              if (category.Name) {
                const itemCount = Object.keys(category).filter(key => 
                  key !== 'Name' && key !== 'CID' && typeof category[key] === 'object' && category[key].Name
                ).length;
                totalMenuItems += itemCount;
              }
            });
          });
          console.log(`     📦 Menu Items: ${totalMenuItems}`);
        } else {
          console.log(`     ❌ No menu found`);
        }
      } catch (error) {
        console.log(`     ❌ Error loading menu: ${error.message}`);
      }
    }
    
    // 4. Verify Orders (90-day range to match dashboard)
    console.log('\n📦 4. ORDER VERIFICATION (90-Day Range):');
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 90); // 90 days back to match dashboard default
    
    const ordersQuery = query(
      collection(db, 'orders'),
      where('createdAt', '>=', Timestamp.fromDate(startDate)),
      where('createdAt', '<=', Timestamp.fromDate(endDate)),
      orderBy('createdAt', 'desc')
    );
    
    const ordersSnapshot = await getDocs(ordersQuery);
    const allOrders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Filter orders by university vendors
    const universityOrders = allOrders.filter(order => vendorIds.includes(order.vendorId));
    
    console.log(`✅ Total Orders (90 days): ${universityOrders.length}`);
    console.log(`   📅 Date Range: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`);
    
    // Order status distribution
    const statusCounts = {};
    universityOrders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });
    
    console.log('\n📊 Order Status Distribution:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      const percentage = Math.round((count / universityOrders.length) * 100);
      const emoji = {
        'completed': '✅',
        'pending': '⏳',
        'confirmed': '👨‍🍳',
        'ready': '🍽️',
        'cancelled': '❌'
      }[status] || '📦';
      console.log(`   ${emoji} ${status}: ${count} (${percentage}%)`);
    });
    
    // 5. Revenue Verification
    console.log('\n💰 5. REVENUE VERIFICATION:');
    const completedOrders = universityOrders.filter(order => order.status === 'completed');
    const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const averageOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;
    
    console.log(`✅ Completed Orders: ${completedOrders.length}`);
    console.log(`✅ Total Revenue: EGP ${totalRevenue.toFixed(2)}`);
    console.log(`✅ Average Order Value: EGP ${averageOrderValue.toFixed(2)}`);
    
    // Payment method distribution
    const paymentMethods = {};
    universityOrders.forEach(order => {
      paymentMethods[order.paymentMethod] = (paymentMethods[order.paymentMethod] || 0) + 1;
    });
    
    console.log('\n💳 Payment Method Distribution:');
    Object.entries(paymentMethods).forEach(([method, count]) => {
      const percentage = Math.round((count / universityOrders.length) * 100);
      console.log(`   ${method}: ${count} (${percentage}%)`);
    });
    
    // 6. Category Analysis
    console.log('\n🍕 6. FOOD CATEGORY ANALYSIS:');
    const categoryStats = {};
    const categoryRevenue = {};
    
    completedOrders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          const category = item.category || 'Unknown';
          categoryStats[category] = (categoryStats[category] || 0) + (item.quantity || 1);
          categoryRevenue[category] = (categoryRevenue[category] || 0) + ((item.price || 0) * (item.quantity || 1));
        });
      }
    });
    
    console.log('📊 Category Performance:');
    const totalItems = Object.values(categoryStats).reduce((sum, count) => sum + count, 0);
    const totalCategoryRevenue = Object.values(categoryRevenue).reduce((sum, rev) => sum + rev, 0);
    
    Object.entries(categoryStats)
      .sort(([,a], [,b]) => b - a) // Sort by order count
      .forEach(([category, count]) => {
        const percentage = Math.round((count / totalItems) * 100);
        const revenue = categoryRevenue[category] || 0;
        const revenuePercentage = totalCategoryRevenue > 0 ? Math.round((revenue / totalCategoryRevenue) * 100) : 0;
        console.log(`   🍽️  ${category}: ${count} orders (${percentage}%) | EGP ${revenue.toFixed(2)} (${revenuePercentage}%)`);
      });
    
    // 7. Time-based Analysis
    console.log('\n⏰ 7. TIME-BASED ANALYSIS:');
    
    // Daily distribution
    const dailyStats = {};
    universityOrders.forEach(order => {
      const date = new Date(order.createdAt.seconds * 1000).toISOString().split('T')[0];
      dailyStats[date] = (dailyStats[date] || 0) + 1;
    });
    
    console.log(`📅 Active Days: ${Object.keys(dailyStats).length}`);
    console.log(`📊 Average Orders/Day: ${Math.round(universityOrders.length / Object.keys(dailyStats).length)}`);
    
    // Hourly distribution
    const hourlyStats = {};
    universityOrders.forEach(order => {
      const hour = new Date(order.createdAt.seconds * 1000).getHours();
      hourlyStats[hour] = (hourlyStats[hour] || 0) + 1;
    });
    
    const peakHour = Object.entries(hourlyStats).reduce((max, [hour, count]) => 
      count > max.count ? { hour: parseInt(hour), count } : max, 
      { hour: 0, count: 0 }
    );
    
    console.log(`⏰ Peak Hour: ${peakHour.hour}:00 (${peakHour.count} orders)`);
    
    // 8. Data Quality Checks
    console.log('\n🔍 8. DATA QUALITY CHECKS:');
    
    let qualityIssues = 0;
    
    // Check for orders without vendor association
    const orphanOrders = universityOrders.filter(order => !vendorIds.includes(order.vendorId));
    if (orphanOrders.length > 0) {
      console.log(`⚠️  ${orphanOrders.length} orders with invalid vendor IDs`);
      qualityIssues++;
    }
    
    // Check for orders without items
    const ordersWithoutItems = universityOrders.filter(order => !order.items || order.items.length === 0);
    if (ordersWithoutItems.length > 0) {
      console.log(`⚠️  ${ordersWithoutItems.length} orders without items`);
      qualityIssues++;
    }
    
    // Check for orders with missing totals
    const ordersWithoutTotals = universityOrders.filter(order => !order.total || order.total <= 0);
    if (ordersWithoutTotals.length > 0) {
      console.log(`⚠️  ${ordersWithoutTotals.length} orders without valid totals`);
      qualityIssues++;
    }
    
    // Check for items without categories
    let itemsWithoutCategories = 0;
    universityOrders.forEach(order => {
      if (order.items) {
        order.items.forEach(item => {
          if (!item.category) itemsWithoutCategories++;
        });
      }
    });
    
    if (itemsWithoutCategories > 0) {
      console.log(`⚠️  ${itemsWithoutCategories} order items without categories`);
      qualityIssues++;
    }
    
    if (qualityIssues === 0) {
      console.log('✅ All data quality checks passed!');
    }
    
    // 9. Dashboard Readiness Summary
    console.log('\n🎯 9. DASHBOARD READINESS SUMMARY:');
    console.log('='.repeat(50));
    
    const readinessChecks = [
      { check: 'University Data', status: targetUniversity ? '✅' : '❌', details: targetUniversity ? 'Found' : 'Missing' },
      { check: 'Students', status: students.length > 0 ? '✅' : '❌', details: `${students.length} students` },
      { check: 'Vendor Businesses', status: vendorBusinesses.length > 0 ? '✅' : '❌', details: `${vendorBusinesses.length} vendors` },
      { check: 'Orders (90 days)', status: universityOrders.length > 0 ? '✅' : '❌', details: `${universityOrders.length} orders` },
      { check: 'Revenue Data', status: completedOrders.length > 0 ? '✅' : '❌', details: `EGP ${totalRevenue.toFixed(2)}` },
      { check: 'Category Data', status: Object.keys(categoryStats).length > 0 ? '✅' : '❌', details: `${Object.keys(categoryStats).length} categories` },
      { check: 'Time Data', status: Object.keys(dailyStats).length > 0 ? '✅' : '❌', details: `${Object.keys(dailyStats).length} active days` },
      { check: 'Data Quality', status: qualityIssues === 0 ? '✅' : '⚠️', details: qualityIssues === 0 ? 'Clean' : `${qualityIssues} issues` }
    ];
    
    readinessChecks.forEach(({ check, status, details }) => {
      console.log(`${status} ${check}: ${details}`);
    });
    
    const overallStatus = readinessChecks.every(r => r.status === '✅') ? '🟢 READY' : '🟡 NEEDS ATTENTION';
    console.log(`\n🎯 Overall Dashboard Status: ${overallStatus}`);
    
    // 10. Expected Dashboard Metrics
    console.log('\n📊 10. EXPECTED DASHBOARD METRICS:');
    console.log('='.repeat(50));
    console.log(`Total Orders: ${universityOrders.length}`);
    console.log(`Completed Orders: ${completedOrders.length}`);
    console.log(`Completion Rate: ${Math.round((completedOrders.length / universityOrders.length) * 100)}%`);
    console.log(`Total Revenue: EGP ${totalRevenue.toFixed(2)}`);
    console.log(`Average Order Value: EGP ${averageOrderValue.toFixed(2)}`);
    console.log(`Active Students: ${students.length}`);
    console.log(`Active Vendors: ${vendorBusinesses.filter(v => v.isOpen && v.isApproved).length}`);
    console.log(`Top Category: ${Object.entries(categoryStats).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}`);
    console.log(`Peak Hour: ${peakHour.hour}:00`);
    console.log(`Date Range: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`);
    
    console.log('\n✅ Dashboard verification completed!');
    console.log('🚀 Your dashboard should now display all metrics correctly with 90-day filter.');
    
  } catch (error) {
    console.error('❌ Error during dashboard verification:', error);
  }
  
  process.exit(0);
}

// Run the verification
verifyDashboard().catch(console.error);
