// Demo data setup script for Egypt University of Informatics
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

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
const auth = getAuth(app);

const UNIVERSITY_NAME = 'Egypt University of Informatics';
const UNIVERSITY_ID = '46676685-c590-40b4-ba8d-03c26a3c2ceb'; // Using existing university ID
const EMAIL_DOMAIN = 'students.eui.edu.eg';

// Demo vendors data
const demoVendors = [
  {
    name: "قهوة الجامعة - University Café",
    description: "أفضل قهوة وساندوتشات في الحرم الجامعي - Best coffee and sandwiches on campus",
    categories: ["Coffee", "Sandwiches", "Pastries"],
    isOpen: true,
    isApproved: true,
    isSuspended: false,
    rating: 4.5,
    reviewCount: 42,
    email: "university.cafe@students.eui.edu.eg",
    menu: {
      coffee: {
        Name: "Coffee & Beverages",
        CID: 1,
        espresso: {
          Name: "Espresso",
          Description: "Rich, bold espresso shot",
          Price: 15,
          Category: "Coffee",
          IsAvailable: true,
          Popularity: 85,
          CustomizationOptions: {
            "Extra Shot": 5,
            "Decaf": 0,
            "Oat Milk": 3
          }
        },
        cappuccino: {
          Name: "Cappuccino",
          Description: "Classic cappuccino with steamed milk foam",
          Price: 25,
          Category: "Coffee",
          IsAvailable: true,
          Popularity: 92,
          CustomizationOptions: {
            "Extra Shot": 5,
            "Vanilla Syrup": 3,
            "Cinnamon": 0
          }
        },
        latte: {
          Name: "Caffe Latte",
          Description: "Smooth espresso with steamed milk",
          Price: 30,
          Category: "Coffee",
          IsAvailable: true,
          Popularity: 88,
          CustomizationOptions: {
            "Extra Shot": 5,
            "Caramel Syrup": 3,
            "Almond Milk": 3
          }
        }
      },
      sandwiches: {
        Name: "Sandwiches",
        CID: 2,
        club_sandwich: {
          Name: "Club Sandwich",
          Description: "Triple-decker with turkey, bacon, lettuce, tomato",
          Price: 45,
          Category: "Sandwiches",
          IsAvailable: true,
          Popularity: 78,
          CustomizationOptions: {
            "Extra Bacon": 8,
            "No Mayo": 0,
            "Add Cheese": 5
          }
        },
        grilled_cheese: {
          Name: "Grilled Cheese",
          Description: "Classic grilled cheese with tomato soup",
          Price: 35,
          Category: "Sandwiches",
          IsAvailable: true,
          Popularity: 82,
          CustomizationOptions: {
            "Add Tomato": 3,
            "Extra Cheese": 5,
            "Whole Wheat Bread": 0
          }
        }
      }
    }
  },
  {
    name: "بيتزا النيل - Pizza El-Nil",
    description: "أفضل بيتزا إيطالية أصلية ومعكرونة في مصر الجديدة - Authentic Italian pizza and pasta in New Cairo",
    categories: ["Pizza", "Pasta", "Italian"],
    isOpen: true,
    isApproved: true,
    isSuspended: false,
    rating: 4.3,
    reviewCount: 67,
    email: "pizza.elnil@students.eui.edu.eg",
    menu: {
      pizza: {
        Name: "Pizza",
        CID: 1,
        margherita: {
          Name: "Margherita Pizza",
          Description: "Classic tomato, mozzarella, and fresh basil",
          Price: 60,
          Category: "Pizza",
          IsAvailable: true,
          Popularity: 95,
          CustomizationOptions: {
            "Extra Cheese": 10,
            "Thin Crust": 0,
            "Extra Basil": 0
          }
        },
        pepperoni: {
          Name: "Pepperoni Pizza",
          Description: "Tomato sauce, mozzarella, and pepperoni",
          Price: 75,
          Category: "Pizza",
          IsAvailable: true,
          Popularity: 89,
          CustomizationOptions: {
            "Extra Pepperoni": 12,
            "Extra Cheese": 10,
            "Thick Crust": 5
          }
        }
      },
      pasta: {
        Name: "Pasta",
        CID: 2,
        spaghetti_carbonara: {
          Name: "Spaghetti Carbonara",
          Description: "Creamy pasta with bacon and parmesan",
          Price: 55,
          Category: "Pasta",
          IsAvailable: true,
          Popularity: 76,
          CustomizationOptions: {
            "Extra Bacon": 8,
            "Extra Parmesan": 5,
            "No Cream": 0
          }
        }
      }
    }
  },
  {
    name: "الأكل الصحي - Healthy Choice",
    description: "سلطات طازجة ووجبات صحية مفيدة للطلاب - Fresh salads, wraps, and healthy options for students",
    categories: ["Salads", "Wraps", "Healthy"],
    isOpen: true,
    isApproved: true,
    isSuspended: false,
    rating: 4.7,
    reviewCount: 29,
    email: "healthy.choice@students.eui.edu.eg",
    menu: {
      salads: {
        Name: "Fresh Salads",
        CID: 1,
        caesar_salad: {
          Name: "Caesar Salad",
          Description: "Romaine lettuce, croutons, parmesan, caesar dressing",
          Price: 40,
          Category: "Salads",
          IsAvailable: true,
          Popularity: 84,
          CustomizationOptions: {
            "Grilled Chicken": 15,
            "Extra Parmesan": 5,
            "No Croutons": 0
          }
        },
        greek_salad: {
          Name: "Greek Salad",
          Description: "Mixed greens, feta, olives, tomatoes, cucumber",
          Price: 45,
          Category: "Salads",
          IsAvailable: true,
          Popularity: 72,
          CustomizationOptions: {
            "Extra Feta": 8,
            "No Olives": 0,
            "Add Avocado": 10
          }
        }
      },
      wraps: {
        Name: "Wraps",
        CID: 2,
        chicken_wrap: {
          Name: "Grilled Chicken Wrap",
          Description: "Grilled chicken, lettuce, tomato, mayo in tortilla",
          Price: 35,
          Category: "Wraps",
          IsAvailable: true,
          Popularity: 86,
          CustomizationOptions: {
            "Extra Chicken": 12,
            "Spicy Sauce": 0,
            "No Mayo": 0
          }
        }
      }
    }
  }
];

// Demo student users (using unique emails to avoid conflicts)
const demoStudents = [
  {
    email: "mohamed.abdelrahman@students.eui.edu.eg",
    password: "demo123456",
    fullName: "Mohamed Abdelrahman",
    universityId: "21-102001",
    phoneNumber: "+201234567890",
    role: "student",
    walletBalance: 150
  },
  {
    email: "yasmin.mahmoud@students.eui.edu.eg",
    password: "demo123456",
    fullName: "Yasmin Mahmoud",
    universityId: "21-102002",
    phoneNumber: "+201234567891",
    role: "student",
    walletBalance: 200
  },
  {
    email: "karim.elshafei@students.eui.edu.eg",
    password: "demo123456",
    fullName: "Karim El-Shafei",
    universityId: "21-102003",
    phoneNumber: "+201234567892",
    role: "student",
    walletBalance: 100
  },
  {
    email: "nour.hassan@students.eui.edu.eg",
    password: "demo123456",
    fullName: "Nour Hassan",
    universityId: "21-102004",
    phoneNumber: "+201234567893",
    role: "student",
    walletBalance: 250
  },
  {
    email: "youssef.ahmed@students.eui.edu.eg",
    password: "demo123456",
    fullName: "Youssef Ahmed",
    universityId: "21-102005",
    phoneNumber: "+201234567894",
    role: "student",
    walletBalance: 80
  }
];

// Function to create university record (skip if exists)
async function createUniversity() {
  console.log('📚 Checking university record...');
  
  try {
    // Check if university already exists
    const docRef = doc(db, 'universities', UNIVERSITY_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log('✅ University already exists - using existing record');
      return;
    }
    
    await setDoc(docRef, {
      id: UNIVERSITY_ID,
      name: UNIVERSITY_NAME,
      nameAr: 'جامعة مصر للمعلوماتية',
      emailDomain: EMAIL_DOMAIN,
      city: 'New Cairo',
      cityAr: 'القاهرة الجديدة',
      address: 'New Cairo, Cairo Governorate',
      addressAr: 'القاهرة الجديدة، محافظة القاهرة',
      phone: '+20 2 26170000',
      website: 'https://eui.edu.eg',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    console.log('✅ University created successfully');
  } catch (error) {
    console.error('❌ Error creating university:', error);
  }
}

// Function to create demo students
async function createDemoStudents() {
  console.log('👥 Creating demo students...');
  
  for (const studentData of demoStudents) {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        studentData.email,
        studentData.password
      );
      
      const userId = userCredential.user.uid;
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', userId), {
        id: userId,
        fullName: studentData.fullName,
        email: studentData.email,
        universityId: studentData.universityId,
        universityName: UNIVERSITY_NAME,
        phoneNumber: studentData.phoneNumber,
        isEmailVerified: false,
        role: studentData.role,
        walletBalance: studentData.walletBalance,
        profileImageUrl: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      console.log(`✅ Student created: ${studentData.fullName} (${userId})`);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️  Student already exists: ${studentData.email}`);
      } else {
        console.error(`❌ Error creating student ${studentData.email}:`, error);
      }
    }
  }
}

// Function to create demo vendors
async function createDemoVendors() {
  console.log('🏪 Creating demo vendors...');
  
  for (const vendorData of demoVendors) {
    try {
      // Create vendor user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        vendorData.email,
        'vendor123456'
      );
      
      const vendorId = userCredential.user.uid;
      
      // Create user document
      await setDoc(doc(db, 'users', vendorId), {
        id: vendorId,
        fullName: vendorData.name + ' Owner',
        email: vendorData.email,
        universityId: 'VENDOR001',
        universityName: UNIVERSITY_NAME,
        phoneNumber: '+201000000000',
        isEmailVerified: false,
        role: 'vendor',
        walletBalance: 0,
        profileImageUrl: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      // Create vendor document
      await setDoc(doc(db, 'vendors', vendorId), {
        name: vendorData.name,
        userId: vendorId,
        universityId: UNIVERSITY_ID,
        universityName: UNIVERSITY_NAME,
        description: vendorData.description,
        imageUrl: "",
        rating: vendorData.rating,
        reviewCount: vendorData.reviewCount,
        categories: vendorData.categories,
        isOpen: vendorData.isOpen,
        isApproved: vendorData.isApproved,
        isSuspended: vendorData.isSuspended,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      // Create menu subcollection
      await setDoc(doc(db, 'vendors', vendorId, 'menu', 'main'), vendorData.menu);
      
      console.log(`✅ Vendor created: ${vendorData.name} (${vendorId})`);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️  Vendor already exists: ${vendorData.email}`);
      } else {
        console.error(`❌ Error creating vendor ${vendorData.name}:`, error);
      }
    }
  }
}

// Function to clean orders from vendor subcollections only
async function cleanVendorOrders() {
  console.log('🧹 Cleaning orders from vendor subcollections...');
  
  try {
    // Get all vendors from the university
    const vendorsQuery = query(
      collection(db, 'vendors'),
      where('universityName', '==', UNIVERSITY_NAME)
    );
    const vendorsSnapshot = await getDocs(vendorsQuery);
    const vendors = vendorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    console.log(`📊 Found ${vendors.length} vendors to check for orders`);
    
    if (vendors.length === 0) {
      console.log('✅ No vendors found');
      return;
    }
    
    let totalVendorOrdersDeleted = 0;
    
    for (const vendor of vendors) {
      try {
        const vendorOrdersSnapshot = await getDocs(collection(db, 'vendors', vendor.id, 'orders'));
        
        if (vendorOrdersSnapshot.docs.length > 0) {
          const vendorDeletePromises = vendorOrdersSnapshot.docs.map(orderDoc => 
            deleteDoc(doc(db, 'vendors', vendor.id, 'orders', orderDoc.id))
          );
          await Promise.all(vendorDeletePromises);
          totalVendorOrdersDeleted += vendorOrdersSnapshot.docs.length;
          console.log(`🗑️  Deleted ${vendorOrdersSnapshot.docs.length} orders from ${vendor.name} subcollection`);
        }
      } catch (error) {
        console.error(`❌ Error cleaning orders from vendor ${vendor.name}:`, error);
      }
    }
    
    console.log(`✅ Vendor orders cleanup completed!`);
    console.log(`📊 Cleanup Summary:`);
    console.log(`   🗑️  Vendor subcollections: ${totalVendorOrdersDeleted} orders deleted`);
    console.log(`   🧹 Total cleanup: ${totalVendorOrdersDeleted} order records removed`);
    
  } catch (error) {
    console.error('❌ Error cleaning vendor order records:', error);
  }
}

// Function to clean orders from user subcollections only
async function cleanUserOrders() {
  console.log('🧹 Cleaning orders from user subcollections...');
  
  try {
    // Get all users from the university
    const usersQuery = query(
      collection(db, 'users'),
      where('universityName', '==', UNIVERSITY_NAME),
      where('role', '==', 'student')
    );
    const usersSnapshot = await getDocs(usersQuery);
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    console.log(`📊 Found ${users.length} users to check for orders`);
    
    if (users.length === 0) {
      console.log('✅ No users found');
      return;
    }
    
    let totalUserOrdersDeleted = 0;
    
    for (const user of users) {
      try {
        const userOrdersSnapshot = await getDocs(collection(db, 'users', user.id, 'orders'));
        
        if (userOrdersSnapshot.docs.length > 0) {
          const userDeletePromises = userOrdersSnapshot.docs.map(orderDoc => 
            deleteDoc(doc(db, 'users', user.id, 'orders', orderDoc.id))
          );
          await Promise.all(userDeletePromises);
          totalUserOrdersDeleted += userOrdersSnapshot.docs.length;
          console.log(`🗑️  Deleted ${userOrdersSnapshot.docs.length} orders from ${user.fullName} subcollection`);
        }
      } catch (error) {
        console.error(`❌ Error cleaning orders from user ${user.fullName}:`, error);
      }
    }
    
    console.log(`✅ User orders cleanup completed!`);
    console.log(`📊 Cleanup Summary:`);
    console.log(`   🗑️  User subcollections: ${totalUserOrdersDeleted} orders deleted`);
    console.log(`   🧹 Total cleanup: ${totalUserOrdersDeleted} order records removed`);
    
  } catch (error) {
    console.error('❌ Error cleaning user order records:', error);
  }
}

// Function to clean all order records
async function cleanAllOrders() {
  console.log('🧹 Cleaning all order records...');
  
  try {
    // Get all orders from main orders collection
    const ordersSnapshot = await getDocs(collection(db, 'orders'));
    console.log(`📊 Found ${ordersSnapshot.docs.length} orders to delete`);
    
    if (ordersSnapshot.docs.length === 0) {
      console.log('✅ No orders found to delete');
      return;
    }
    
    // Delete orders in batches (Firebase has a limit on batch operations)
    const batchSize = 500;
    let deletedCount = 0;
    
    for (let i = 0; i < ordersSnapshot.docs.length; i += batchSize) {
      const batch = ordersSnapshot.docs.slice(i, i + batchSize);
      
      // Delete orders from main collection using deleteDoc
      const deletePromises = batch.map(orderDoc => {
        return deleteDoc(doc(db, 'orders', orderDoc.id));
      });
      
      await Promise.all(deletePromises);
      deletedCount += batch.length;
      console.log(`🗑️  Deleted ${deletedCount}/${ordersSnapshot.docs.length} orders from main collection...`);
    }
    
    console.log(`✅ Order cleanup completed!`);
    console.log(`📊 Cleanup Summary:`);
    console.log(`   🗑️  Main collection: ${deletedCount} orders deleted`);
    console.log(`   🧹 Total cleanup: ${deletedCount} order records removed`);
    
  } catch (error) {
    console.error('❌ Error cleaning order records:', error);
  }
}

// Function to create sample orders
async function createSampleOrders() {
  console.log('📦 Creating sample orders...');
  
  try {
    // Get created students and vendors
    const studentsQuery = query(
      collection(db, 'users'),
      where('universityName', '==', UNIVERSITY_NAME),
      where('role', '==', 'student')
    );
    const studentsSnapshot = await getDocs(studentsQuery);
    const students = studentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const vendorsQuery = query(
      collection(db, 'vendors'),
      where('universityName', '==', UNIVERSITY_NAME)
    );
    const vendorsSnapshot = await getDocs(vendorsQuery);
    const vendors = vendorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    if (students.length === 0 || vendors.length === 0) {
      console.log('⚠️  No students or vendors found. Please create them first.');
      return;
    }
    
    // Define menu items for each vendor
    const vendorMenuItems = {
      0: [ // University Café
        { id: "espresso", name: "Espresso", price: 15, category: "Coffee", customizations: { "Extra Shot": 5 } },
        { id: "cappuccino", name: "Cappuccino", price: 25, category: "Coffee", customizations: { "Vanilla Syrup": 3 } },
        { id: "latte", name: "Caffe Latte", price: 30, category: "Coffee", customizations: { "Caramel Syrup": 3 } },
        { id: "club_sandwich", name: "Club Sandwich", price: 45, category: "Sandwiches", customizations: { "Extra Bacon": 8 } },
        { id: "grilled_cheese", name: "Grilled Cheese", price: 35, category: "Sandwiches", customizations: { "Extra Cheese": 5 } }
      ],
      1: [ // Pizza El-Nil
        { id: "margherita", name: "Margherita Pizza", price: 60, category: "Pizza", customizations: { "Extra Cheese": 10 } },
        { id: "pepperoni", name: "Pepperoni Pizza", price: 75, category: "Pizza", customizations: { "Extra Pepperoni": 12 } },
        { id: "spaghetti_carbonara", name: "Spaghetti Carbonara", price: 55, category: "Pasta", customizations: { "Extra Bacon": 8 } }
      ],
      2: [ // Healthy Choice
        { id: "caesar_salad", name: "Caesar Salad", price: 40, category: "Salads", customizations: { "Grilled Chicken": 15 } },
        { id: "greek_salad", name: "Greek Salad", price: 45, category: "Salads", customizations: { "Extra Feta": 8 } },
        { id: "chicken_wrap", name: "Grilled Chicken Wrap", price: 35, category: "Wraps", customizations: { "Extra Chicken": 12 } }
      ]
    };

    // Helper function to get random items from a vendor
    const getRandomItemsFromVendor = (vendorIndex, maxItems = 3) => {
      const items = vendorMenuItems[vendorIndex];
      const numItems = Math.floor(Math.random() * maxItems) + 1; // 1 to maxItems
      const selectedItems = [];
      
      for (let i = 0; i < numItems; i++) {
        const item = items[Math.floor(Math.random() * items.length)];
        const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 quantity
        const useCustomization = Math.random() > 0.5;
        
        selectedItems.push({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: quantity,
          note: Math.random() > 0.7 ? ["Extra hot", "Well done", "On the side", "No spice", "Extra sauce"][Math.floor(Math.random() * 5)] : "",
          customizations: useCustomization ? item.customizations : {},
          category: item.category
        });
      }
      
      return selectedItems;
    };

    // Helper function to calculate total
    const calculateTotal = (items) => {
      return items.reduce((total, item) => {
        const customizationCost = Object.values(item.customizations).reduce((sum, cost) => sum + cost, 0);
        return total + ((item.price + customizationCost) * item.quantity);
      }, 0);
    };

    // Generate orders for the last 3 months (90 days)
    const orders = [];
    const now = new Date();
    const threeMonthsAgo = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000)); // 90 days ago
    
    console.log(`📅 Generating orders from ${threeMonthsAgo.toLocaleDateString()} to ${now.toLocaleDateString()}`);
    
    // Create 200-300 orders spread across 3 months
    const totalOrders = Math.floor(Math.random() * 101) + 200; // 200-300 orders
    console.log(`🎯 Target orders: ${totalOrders}`);
    
    // Helper function to generate random time between 9:15 AM and 3:30 PM
    const getRandomOrderTime = (baseDate) => {
      const startHour = 9;
      const startMinute = 15;
      const endHour = 15;
      const endMinute = 30;
      
      // Convert to minutes from midnight
      const startMinutes = startHour * 60 + startMinute; // 9:15 AM = 555 minutes
      const endMinutes = endHour * 60 + endMinute; // 3:30 PM = 930 minutes
      
      // Random minute between start and end
      const randomMinutes = Math.floor(Math.random() * (endMinutes - startMinutes)) + startMinutes;
      const randomHour = Math.floor(randomMinutes / 60);
      const randomMinute = randomMinutes % 60;
      
      const orderTime = new Date(baseDate);
      orderTime.setHours(randomHour, randomMinute, Math.floor(Math.random() * 60), 0);
      return orderTime;
    };
    
    // Helper function to check if date is Sunday to Thursday (0=Sunday, 1=Monday, ..., 4=Thursday)
    const isValidOrderDay = (date) => {
      const dayOfWeek = date.getDay();
      return dayOfWeek >= 0 && dayOfWeek <= 4; // Sunday (0) to Thursday (4)
    };
    
    for (let i = 0; i < totalOrders; i++) {
      let randomTime;
      let attempts = 0;
      const maxAttempts = 100;
      
      // Keep generating random times until we get a valid day (Sunday-Thursday)
      do {
        const randomDay = new Date(threeMonthsAgo.getTime() + Math.random() * (now.getTime() - threeMonthsAgo.getTime()));
        randomTime = getRandomOrderTime(randomDay);
        attempts++;
      } while (!isValidOrderDay(randomTime) && attempts < maxAttempts);
      
      // Fallback: if we can't find a valid day after many attempts, skip this order
      if (!isValidOrderDay(randomTime)) {
        continue;
      }
      
      // Random student and vendor
      const studentIndex = Math.floor(Math.random() * students.length);
      const vendorIndex = Math.floor(Math.random() * Math.min(vendors.length, 3)); // Only use first 3 vendors
      
      // Get items from this vendor only
      const items = getRandomItemsFromVendor(vendorIndex);
      const total = calculateTotal(items);
      
      // Determine order status: 88% completed, 12% other statuses
      const statusRandom = Math.random();
      let orderStatus, confirmedAt, readyAt, completedAt;
      
      // Generate completion times (5-30 minutes after creation)
      const completionDelay = (Math.floor(Math.random() * 25) + 5) * 60 * 1000; // 5-30 minutes
      const baseConfirmedAt = new Date(randomTime.getTime() + Math.floor(completionDelay * 0.2)); // 20% through
      const baseReadyAt = new Date(randomTime.getTime() + Math.floor(completionDelay * 0.8)); // 80% through
      const baseCompletedAt = new Date(randomTime.getTime() + completionDelay);
      
      if (statusRandom < 0.88) {
        // 88% completed orders
        orderStatus = "completed";
        confirmedAt = baseConfirmedAt;
        readyAt = baseReadyAt;
        completedAt = baseCompletedAt;
      } else if (statusRandom < 0.92) {
        // 4% ready orders (pending pickup)
        orderStatus = "ready";
        confirmedAt = baseConfirmedAt;
        readyAt = baseReadyAt;
        completedAt = null;
      } else if (statusRandom < 0.96) {
        // 4% confirmed orders (being prepared)
        orderStatus = "confirmed";
        confirmedAt = baseConfirmedAt;
        readyAt = null;
        completedAt = null;
      } else {
        // 4% pending orders (awaiting vendor confirmation)
        orderStatus = "pending";
        confirmedAt = null;
        readyAt = null;
        completedAt = null;
      }
      
      orders.push({
        userId: students[studentIndex].id,
        vendorId: vendors[vendorIndex].id,
        items: items,
        total: total,
        status: orderStatus,
        paymentMethod: Math.random() > 0.3 ? "Wallet" : "Cash", // 70% Wallet, 30% Cash
        createdAt: randomTime,
        confirmedAt: confirmedAt,
        readyAt: readyAt,
        completedAt: completedAt
      });
    }
    
    // Sort orders by creation time
    orders.sort((a, b) => a.createdAt - b.createdAt);
    
    console.log(`📦 Creating ${orders.length} orders with mixed statuses...`);
    
    // Create orders in Firebase
    let createdCount = 0;
    for (const orderData of orders) {
      // Build status history based on order status
      const statusHistory = [
        {
          status: "pending",
          timestamp: orderData.createdAt,
          updatedBy: orderData.userId,
          note: "Order placed"
        }
      ];
      
      if (orderData.confirmedAt) {
        statusHistory.push({
          status: "confirmed",
          timestamp: orderData.confirmedAt,
          updatedBy: orderData.vendorId,
          note: "Order confirmed by vendor"
        });
      }
      
      if (orderData.readyAt) {
        statusHistory.push({
          status: "ready",
          timestamp: orderData.readyAt,
          updatedBy: orderData.vendorId,
          note: "Order ready for pickup"
        });
      }
      
      if (orderData.completedAt) {
        statusHistory.push({
          status: "completed",
          timestamp: orderData.completedAt,
          updatedBy: orderData.vendorId,
          note: "Order completed"
        });
      }
      
      const orderRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        id: '', // Will be set after creation
        statusHistory: statusHistory,
        schemaVersion: "2.0"
      });
      
      // Update order with its ID
      await setDoc(doc(db, 'orders', orderRef.id), {
        ...orderData,
        id: orderRef.id,
        statusHistory: statusHistory,
        schemaVersion: "2.0"
      });
      
      // Also add to vendor's orders subcollection
      await setDoc(doc(db, 'vendors', orderData.vendorId, 'orders', orderRef.id), {
        id: orderRef.id,
        userId: orderData.userId,
        vendorId: orderData.vendorId,
        items: orderData.items,
        total: orderData.total,
        status: orderData.status,
        paymentMethod: orderData.paymentMethod,
        createdAt: orderData.createdAt
      });
      
      createdCount++;
      if (createdCount % 25 === 0) {
        console.log(`✅ Created ${createdCount}/${orders.length} orders...`);
      }
    }
    
    console.log(`✅ All ${orders.length} orders created successfully!`);
    
    // Calculate and show statistics
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const walletOrders = orders.filter(o => o.paymentMethod === 'Wallet').length;
    const cashOrders = orders.filter(o => o.paymentMethod === 'Cash').length;
    
    // Status distribution
    const statusStats = {};
    orders.forEach(order => {
      statusStats[order.status] = (statusStats[order.status] || 0) + 1;
    });
    
    console.log(`📊 Order Statistics:`);
    console.log(`   💰 Total Revenue: ${totalRevenue} EGP`);
    console.log(`   💳 Wallet Orders: ${walletOrders} (${Math.round(walletOrders/orders.length*100)}%)`);
    console.log(`   💵 Cash Orders: ${cashOrders} (${Math.round(cashOrders/orders.length*100)}%)`);
    
    console.log(`📈 Order Status Distribution:`);
    Object.entries(statusStats).forEach(([status, count]) => {
      const percentage = Math.round(count/orders.length*100);
      const emoji = status === 'completed' ? '✅' : status === 'ready' ? '🍽️' : status === 'confirmed' ? '👨‍🍳' : '⏳';
      console.log(`   ${emoji} ${status.charAt(0).toUpperCase() + status.slice(1)}: ${count} orders (${percentage}%)`);
    });
    
    // Show vendor distribution
    const vendorStats = {};
    orders.forEach(order => {
      const vendorName = vendors.find(v => v.id === order.vendorId)?.name || 'Unknown';
      vendorStats[vendorName] = (vendorStats[vendorName] || 0) + 1;
    });
    
    console.log(`🏪 Orders per Vendor:`);
    Object.entries(vendorStats).forEach(([name, count]) => {
      console.log(`   - ${name}: ${count} orders (${Math.round(count/orders.length*100)}%)`);
    });
    
  } catch (error) {
    console.error('❌ Error creating sample orders:', error);
  }
}

// Main setup function
async function setupDemoData() {
  console.log('🚀 Setting up demo data for Egypt University of Informatics...');
  console.log('='.repeat(60));
  
  await createUniversity();
  await createDemoStudents();
  await createDemoVendors();
  await createSampleOrders();
  
  console.log('\n✅ Demo data setup completed!');
  console.log('\n📊 Summary:');
  console.log('- University: Egypt University of Informatics');
  console.log('- Students: 5 demo accounts with Egyptian names');
  console.log('- Vendors: 3 Egyptian-themed vendors with Arabic/English names');
  console.log('- Orders: 200-300 orders spread across last 3 months');
  console.log('- Status Mix: 88% completed, 4% ready, 4% confirmed, 4% pending');
  console.log('- Schedule: Sunday to Thursday, 9:15 AM to 3:30 PM only');
  console.log('- Timeline: All orders have realistic timestamps from May 9 to August 9, 2025');
  console.log('\n🔐 Demo Student Login Credentials:');
  demoStudents.forEach(student => {
    console.log(`- ${student.email} / ${student.password} (${student.fullName})`);
  });
  console.log('\n🏪 Demo Vendor Login Credentials:');
  demoVendors.forEach(vendor => {
    console.log(`- ${vendor.email} / vendor123456 (${vendor.name})`);
  });
  demoVendors.forEach(vendor => {
    console.log(`- ${vendor.email} / vendor123456 (${vendor.name})`);
  });
  
  process.exit(0);
}

// Main setup function with clean option
async function setupDemoDataWithCleanup() {
  console.log('🚀 Setting up demo data for Egypt University of Informatics (with cleanup)...');
  console.log('='.repeat(60));
  
  // Clean existing orders first
  await cleanAllOrders();
  console.log('⏳ Waiting 2 seconds before creating new data...\n');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await createUniversity();
  await createDemoStudents();
  await createDemoVendors();
  await createSampleOrders();
  
  console.log('\n✅ Demo data setup with cleanup completed!');
  console.log('\n📊 Summary:');
  console.log('- University: Egypt University of Informatics');
  console.log('- Students: 5 demo accounts with Egyptian names');
  console.log('- Vendors: 3 Egyptian-themed vendors with Arabic/English names');
  console.log('- Orders: 200-300 orders spread across last 3 months');
  console.log('- Status Mix: 88% completed, 4% ready, 4% confirmed, 4% pending');
  console.log('- Schedule: Sunday to Thursday, 9:15 AM to 3:30 PM only');
  console.log('- Timeline: All orders have realistic timestamps from May 9 to August 9, 2025');
  console.log('\n🔐 Demo Student Login Credentials:');
  demoStudents.forEach(student => {
    console.log(`- ${student.email} / ${student.password} (${student.fullName})`);
  });
  console.log('\n🏪 Demo Vendor Login Credentials:');
  demoVendors.forEach(vendor => {
    console.log(`- ${vendor.email} / vendor123456 (${vendor.name})`);
  });
  
  process.exit(0);
}

// Function to only clean vendor orders (standalone)
async function runVendorOrdersCleanupOnly() {
  console.log('🧹 Running vendor orders cleanup only...');
  console.log('='.repeat(40));
  
  await cleanVendorOrders();
  
  console.log('\n✅ Vendor orders cleanup completed!');
  process.exit(0);
}

// Function to only clean user orders (standalone)
async function runUserOrdersCleanupOnly() {
  console.log('🧹 Running user orders cleanup only...');
  console.log('='.repeat(40));
  
  await cleanUserOrders();
  
  console.log('\n✅ User orders cleanup completed!');
  process.exit(0);
}

// Run the setup based on command line arguments
const args = process.argv.slice(2);
const command = args[0];

console.log('🎯 Available commands:');
console.log('  - node setup_demo_data.js                  (create demo data)');
console.log('  - node setup_demo_data.js clean            (setup with cleanup)');
console.log('  - node setup_demo_data.js cleanup          (cleanup main orders only)');
console.log('  - node setup_demo_data.js cleanup-users    (cleanup user orders only)');
console.log('  - node setup_demo_data.js cleanup-vendors  (cleanup vendor orders only)');
console.log('');

switch(command) {
  case 'clean':
    setupDemoDataWithCleanup().catch(console.error);
    break;
  case 'cleanup':
    runCleanupOnly().catch(console.error);
    break;
  case 'cleanup-users':
    runUserOrdersCleanupOnly().catch(console.error);
    break;
  case 'cleanup-vendors':
    runVendorOrdersCleanupOnly().catch(console.error);
    break;
  default:
    setupDemoData().catch(console.error);
    break;
}
