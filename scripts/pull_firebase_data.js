// Script to pull and display existing data from Firebase for Egypt University of Informatics
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, orderBy } from 'firebase/firestore';

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

async function pullFirebaseData() {
  console.log('📡 Pulling data from Firebase for Egypt University of Informatics...');
  console.log('='.repeat(70));
  
  try {
    // 1. Check Universities
    console.log('\n🏛️  UNIVERSITIES:');
    const universitiesSnapshot = await getDocs(collection(db, 'universities'));
    const universities = universitiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    if (universities.length === 0) {
      console.log('❌ No universities found in database');
    } else {
      universities.forEach(uni => {
        console.log(`- ${uni.name} (${uni.id}) - Domain: ${uni.emailDomain}`);
      });
    }
    
    // 2. Get Users for our university
    console.log('\n👥 USERS (Egypt University of Informatics):');
    const usersQuery = query(
      collection(db, 'users'),
      where('universityName', '==', UNIVERSITY_NAME)
    );
    const usersSnapshot = await getDocs(usersQuery);
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    if (users.length === 0) {
      console.log('❌ No users found for Egypt University of Informatics');
    } else {
      const students = users.filter(u => u.role === 'student');
      const vendors = users.filter(u => u.role === 'vendor');
      const admins = users.filter(u => u.role === 'admin');
      
      console.log(`📊 Total Users: ${users.length}`);
      console.log(`   - Students: ${students.length}`);
      console.log(`   - Vendors: ${vendors.length}`);
      console.log(`   - Admins: ${admins.length}`);
      
      console.log('\n👨‍🎓 Students:');
      students.forEach(student => {
        console.log(`   - ${student.fullName} (${student.email}) - Balance: ${student.walletBalance} EGP`);
      });
      
      console.log('\n👨‍💼 Vendor Accounts:');
      vendors.forEach(vendor => {
        console.log(`   - ${vendor.fullName} (${vendor.email})`);
      });
    }
    
    // 3. Get Vendors for our university
    console.log('\n🏪 VENDORS (Egypt University of Informatics):');
    const vendorsQuery = query(
      collection(db, 'vendors'),
      where('universityName', '==', UNIVERSITY_NAME)
    );
    const vendorsSnapshot = await getDocs(vendorsQuery);
    const vendors = vendorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    if (vendors.length === 0) {
      console.log('❌ No vendors found for Egypt University of Informatics');
    } else {
      console.log(`📊 Total Vendors: ${vendors.length}`);
      
      for (const vendor of vendors) {
        console.log(`\n🏪 ${vendor.name} (${vendor.id})`);
        console.log(`   - Description: ${vendor.description}`);
        console.log(`   - Categories: ${vendor.categories?.join(', ') || 'None'}`);
        console.log(`   - Status: ${vendor.isOpen ? '🟢 Open' : '🔴 Closed'} | ${vendor.isApproved ? '✅ Approved' : '⏳ Pending'} | ${vendor.isSuspended ? '🚫 Suspended' : '✅ Active'}`);
        console.log(`   - Rating: ${vendor.rating || 'N/A'} ⭐ (${vendor.reviewCount || 0} reviews)`);
        
        // Get vendor menu
        try {
          const menuSnapshot = await getDocs(collection(db, 'vendors', vendor.id, 'menu'));
          if (menuSnapshot.size > 0) {
            console.log(`   - Menu Items: ${menuSnapshot.size} categories`);
            menuSnapshot.docs.forEach(menuDoc => {
              const menuData = menuDoc.data();
              Object.keys(menuData).forEach(categoryKey => {
                const category = menuData[categoryKey];
                if (category.Name) {
                  console.log(`     📂 ${category.Name}`);
                  Object.keys(category).forEach(itemKey => {
                    const item = category[itemKey];
                    if (item.Name && item.Price) {
                      console.log(`       - ${item.Name}: ${item.Price} EGP ${item.IsAvailable === false ? '(❌ Unavailable)' : ''}`);
                    }
                  });
                }
              });
            });
          } else {
            console.log(`   - Menu Items: ❌ No menu found`);
          }
        } catch (error) {
          console.log(`   - Menu Items: ❌ Error loading menu`);
        }
      }
    }
    
    // 4. Get Orders for our university (by vendor)
    console.log('\n📦 ORDERS (Egypt University of Informatics):');
    let totalOrders = 0;
    let ordersByStatus = {
      pending: 0,
      confirmed: 0,
      ready: 0,
      completed: 0,
      cancelled: 0
    };
    
    if (vendors.length > 0) {
      const vendorIds = vendors.map(v => v.id);
      
      // Get all orders for our vendors
      const allOrdersSnapshot = await getDocs(collection(db, 'orders'));
      const allOrders = allOrdersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Filter orders for our university vendors
      const universityOrders = allOrders.filter(order => vendorIds.includes(order.vendorId));
      totalOrders = universityOrders.length;
      
      if (totalOrders === 0) {
        console.log('❌ No orders found for Egypt University of Informatics vendors');
      } else {
        // Count orders by status
        universityOrders.forEach(order => {
          ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;
        });
        
        console.log(`📊 Total Orders: ${totalOrders}`);
        console.log(`   - Pending: ${ordersByStatus.pending || 0}`);
        console.log(`   - Confirmed: ${ordersByStatus.confirmed || 0}`);
        console.log(`   - Ready: ${ordersByStatus.ready || 0}`);
        console.log(`   - Completed: ${ordersByStatus.completed || 0}`);
        console.log(`   - Cancelled: ${ordersByStatus.cancelled || 0}`);
        
        console.log('\n📋 Recent Orders:');
        const recentOrders = universityOrders
          .sort((a, b) => {
            const aTime = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
            const bTime = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
            return bTime - aTime;
          })
          .slice(0, 5);
        
        recentOrders.forEach(order => {
          const vendor = vendors.find(v => v.id === order.vendorId);
          const user = users.find(u => u.id === order.userId);
          const orderTime = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
          
          console.log(`   📦 Order ${order.id}`);
          console.log(`      - Customer: ${user?.fullName || 'Unknown'}`);
          console.log(`      - Vendor: ${vendor?.name || 'Unknown'}`);
          console.log(`      - Items: ${order.items?.length || 0} items`);
          console.log(`      - Total: ${order.total} EGP`);
          console.log(`      - Status: ${order.status}`);
          console.log(`      - Payment: ${order.paymentMethod}`);
          console.log(`      - Time: ${orderTime.toLocaleString()}`);
          
          if (order.items && order.items.length > 0) {
            console.log(`      - Items:`);
            order.items.forEach(item => {
              console.log(`        • ${item.quantity}x ${item.name} - ${item.price} EGP`);
            });
          }
          console.log('');
        });
      }
    }
    
    // 5. Summary
    console.log('\n📈 SUMMARY:');
    console.log('='.repeat(40));
    console.log(`🏛️  Universities in DB: ${universities.length}`);
    console.log(`👥 Users (EUI): ${users.length}`);
    console.log(`🏪 Vendors (EUI): ${vendors.length}`);
    console.log(`📦 Orders (EUI): ${totalOrders}`);
    
    // Calculate total revenue from the filtered orders
    let totalRevenue = 0;
    if (vendors.length > 0) {
      const allOrdersSnapshot = await getDocs(collection(db, 'orders'));
      const allOrders = allOrdersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const vendorIds = vendors.map(v => v.id);
      const universityOrders = allOrders.filter(order => vendorIds.includes(order.vendorId));
      totalRevenue = universityOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    }
    
    console.log(`💰 Total Revenue (EUI): ${totalRevenue} EGP`);
    
    if (universities.length === 0 || users.length === 0 || vendors.length === 0) {
      console.log('\n🔧 RECOMMENDATION: Run the demo setup script to create sample data:');
      console.log('   node scripts/setup_demo_data.js');
    }
    
  } catch (error) {
    console.error('❌ Error pulling Firebase data:', error);
  }
  
  process.exit(0);
}

// Run the data pull
pullFirebaseData().catch(console.error);
