#!/usr/bin/env node
/**
 * Comprehensive Demo Data Setup Script for Appwrite - Egypt University of Informatics
 * This script creates complete demo data for all collections in Appwrite
 * 
 * Features:
 * - 5 demo students with Egyptian names
 * - 3 Egyptian-themed vendors with Arabic/English names  
 * - 200-300 realistic orders spread across last 3 months
 * - Mixed order statuses (88% completed, 4% ready, 4% confirmed, 4% pending)
 * - Orders only on Sunday-Thursday, 9:15 AM to 3:30 PM
 * - Realistic completion times and status history
 * - Full menu structures with customizations
 * - Cleanup functionality
 */

const { Client, Databases, Users, Account, ID } = require('node-appwrite');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

// Configuration
const config = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  apiKey: process.env.APPWRITE_API_KEY,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main',
  collections: {
    users: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || 'users',
    vendors: process.env.NEXT_PUBLIC_APPWRITE_VENDORS_COLLECTION_ID || 'vendors',
    orders: process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID || 'orders',
    universities: process.env.NEXT_PUBLIC_APPWRITE_UNIVERSITIES_COLLECTION_ID || 'universities',
    complaints: process.env.NEXT_PUBLIC_APPWRITE_COMPLAINTS_COLLECTION_ID || 'complaints',
    notifications: process.env.NEXT_PUBLIC_APPWRITE_NOTIFICATIONS_COLLECTION_ID || 'notifications',
    transactions: process.env.NEXT_PUBLIC_APPWRITE_TRANSACTIONS_COLLECTION_ID || 'transactions',
    reviews: process.env.NEXT_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID || 'reviews',
    oneTimeCodes: process.env.NEXT_PUBLIC_APPWRITE_ONE_TIME_CODES_COLLECTION_ID || 'oneTimeCodes',
    analytics: process.env.NEXT_PUBLIC_APPWRITE_ANALYTICS_COLLECTION_ID || 'analytics',
    menus: process.env.NEXT_PUBLIC_APPWRITE_MENUS_COLLECTION_ID || 'menus',
    categories: process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID || 'categories',
    menuItems: process.env.NEXT_PUBLIC_APPWRITE_MENU_ITEMS_COLLECTION_ID || 'menuItems'
  }
};

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId);

if (config.apiKey) {
  client.setKey(config.apiKey);
}

const databases = new Databases(client);
const users = new Users(client);

const UNIVERSITY_NAME = 'Egypt University of Informatics';
const UNIVERSITY_ID = 'egypt-university-informatics';
const EMAIL_DOMAIN = 'students.eui.edu.eg';

// Demo vendors data with complete menu structures
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
    menu: JSON.stringify({
      coffee: {
        Name: "Coffee & Beverages",
        NameAr: "القهوة والمشروبات",
        CID: 1,
        espresso: {
          Name: "Espresso",
          NameAr: "إسبريسو",
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
          NameAr: "كابتشينو",
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
          NameAr: "لاتيه",
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
        NameAr: "الساندوتشات",
        CID: 2,
        club_sandwich: {
          Name: "Club Sandwich",
          NameAr: "ساندوتش كلوب",
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
          NameAr: "جبنة مشوية",
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
    })
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
    menu: JSON.stringify({
      pizza: {
        Name: "Pizza",
        NameAr: "البيتزا",
        CID: 1,
        margherita: {
          Name: "Margherita Pizza",
          NameAr: "بيتزا مارجريتا",
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
          NameAr: "بيتزا البيبروني",
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
        NameAr: "المعكرونة",
        CID: 2,
        spaghetti_carbonara: {
          Name: "Spaghetti Carbonara",
          NameAr: "سباجيتي كاربونارا",
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
    })
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
    menu: JSON.stringify({
      salads: {
        Name: "Fresh Salads",
        NameAr: "السلطات الطازجة",
        CID: 1,
        caesar_salad: {
          Name: "Caesar Salad",
          NameAr: "سلطة سيزار",
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
          NameAr: "السلطة اليونانية",
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
        NameAr: "اللفائف",
        CID: 2,
        chicken_wrap: {
          Name: "Grilled Chicken Wrap",
          NameAr: "لفافة الدجاج المشوي",
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
    })
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

// Utility functions
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

function validateConfig() {
  if (!config.projectId) {
    throw new Error('NEXT_PUBLIC_APPWRITE_PROJECT_ID is required');
  }
  if (!config.apiKey) {
    throw new Error('APPWRITE_API_KEY is required');
  }
  log('✅ Configuration validated');
}

// Function to create university record (skip if exists)
async function createUniversity() {
  log('📚 Checking university record...');
  
  try {
    // Check if university already exists
    try {
      const existing = await databases.getDocument(
        config.databaseId,
        config.collections.universities,
        UNIVERSITY_ID
      );
      log('✅ University already exists - using existing record');
      return;
    } catch (error) {
      if (error.code !== 404) {
        throw error;
      }
    }
    
    await databases.createDocument(
      config.databaseId,
      config.collections.universities,
      UNIVERSITY_ID,
      {
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
        isActive: true
      }
    );
    
    log('✅ University created successfully', 'success');
  } catch (error) {
    log(`❌ Error creating university: ${error.message}`, 'error');
    throw error;
  }
}

// Function to create demo students
async function createDemoStudents() {
  log('👥 Creating demo students...');
  
  for (const studentData of demoStudents) {
    try {
      // Create user account in Appwrite Auth
      const user = await users.create(
        ID.unique(),
        studentData.email,
        undefined, // phone
        studentData.password,
        studentData.fullName
      );
      
      // Create user document in database
      await databases.createDocument(
        config.databaseId,
        config.collections.users,
        user.$id,
        {
          id: user.$id,
          fullName: studentData.fullName,
          email: studentData.email,
          universityId: studentData.universityId,
          universityName: UNIVERSITY_NAME,
          phoneNumber: studentData.phoneNumber,
          isEmailVerified: false,
          role: studentData.role,
          walletBalance: studentData.walletBalance,
          fcmToken: ""
        }
      );
      
      log(`✅ Student created: ${studentData.fullName} (${user.$id})`, 'success');
    } catch (error) {
      if (error.code === 409) {
        log(`⚠️  Student already exists: ${studentData.email}`, 'warning');
      } else {
        log(`❌ Error creating student ${studentData.email}: ${error.message}`, 'error');
      }
    }
  }
}

// Function to create demo vendors
async function createDemoVendors() {
  log('🏪 Creating demo vendors...');
  
  const createdVendors = [];
  
  for (const vendorData of demoVendors) {
    try {
      // Create vendor user in Appwrite Auth
      const user = await users.create(
        ID.unique(),
        vendorData.email,
        undefined, // phone
        'vendor123456',
        vendorData.name + ' Owner'
      );
      
      // Create user document
      await databases.createDocument(
        config.databaseId,
        config.collections.users,
        user.$id,
        {
          id: user.$id,
          fullName: vendorData.name + ' Owner',
          email: vendorData.email,
          universityId: 'VENDOR001',
          universityName: UNIVERSITY_NAME,
          phoneNumber: '+201000000000',
          isEmailVerified: false,
          role: 'vendor',
          walletBalance: 0,
          fcmToken: ""
        }
      );
      
      // Create vendor document (without menu field for now)
      await databases.createDocument(
        config.databaseId,
        config.collections.vendors,
        user.$id,
        {
          id: user.$id,
          name: vendorData.name,
          userId: user.$id,
          universityId: UNIVERSITY_ID,
          universityName: UNIVERSITY_NAME,
          description: vendorData.description,
          rating: vendorData.rating,
          reviewCount: vendorData.reviewCount,
          categories: vendorData.categories, // Send as array, not JSON string
          isOpen: vendorData.isOpen,
          isApproved: vendorData.isApproved,
          isSuspended: vendorData.isSuspended
        }
      );
      
      // Create main menu document for this vendor
      const menuData = JSON.parse(vendorData.menu);
      await databases.createDocument(
        config.databaseId,
        config.collections.menus,
        user.$id, // Use vendor ID as menu ID for main menu
        {
          id: user.$id,
          vendorId: user.$id,
          name: 'Main Menu',
          description: `Main menu for ${vendorData.name}`,
          isActive: true,
          displayOrder: 1
        }
      );
      
      // Create categories and menu items
      let categoryOrder = 1;
      for (const [categoryKey, categoryData] of Object.entries(menuData)) {
        // Create category
        const categoryId = ID.unique();
        await databases.createDocument(
          config.databaseId,
          config.collections.categories,
          categoryId,
          {
            id: categoryId,
            vendorId: user.$id,
            menuId: user.$id,
            name: categoryData.Name,
            nameAr: categoryData.NameAr || '',
            description: categoryData.Description || '',
            isActive: true,
            displayOrder: categoryOrder++
          }
        );
        
        // Create menu items for this category
        let itemOrder = 1;
        for (const [itemKey, itemData] of Object.entries(categoryData)) {
          if (itemKey === 'Name' || itemKey === 'CID' || itemKey === 'NameAr' || itemKey === 'Description') continue;
          
          const itemId = ID.unique();
          await databases.createDocument(
            config.databaseId,
            config.collections.menuItems,
            itemId,
            {
              id: itemId,
              vendorId: user.$id,
              menuId: user.$id,
              categoryId: categoryId,
              name: itemData.Name,
              nameAr: itemData.NameAr || '',
              description: itemData.Description || '',
              price: itemData.Price,
              isAvailable: itemData.IsAvailable !== false,
              popularity: itemData.Popularity || 0,
              customizationOptions: JSON.stringify(itemData.CustomizationOptions || {}),
              allergens: JSON.stringify(itemData.Allergens || []),
              nutritionalInfo: JSON.stringify(itemData.NutritionalInfo || {}),
              preparationTime: itemData.PreparationTime || 0,
              displayOrder: itemOrder++,
              tags: JSON.stringify(itemData.Tags || [])
            }
          );
        }
      }
      
      createdVendors.push(user);
      log(`✅ Vendor created: ${vendorData.name} (${user.$id}) with menu structure`, 'success');
    } catch (error) {
      if (error.code === 409) {
        log(`⚠️  Vendor already exists: ${vendorData.email}`, 'warning');
      } else {
        log(`❌ Error creating vendor ${vendorData.name}: ${error.message}`, 'error');
      }
    }
  }
  
  return createdVendors;
}

// Function to clean all orders and menu data
async function cleanAllOrders() {
  log('🧹 Cleaning all order and menu records...');
  
  try {
    // Clean orders
    const ordersResponse = await databases.listDocuments(
      config.databaseId,
      config.collections.orders,
      []
    );
    
    log(`📊 Found ${ordersResponse.documents.length} orders to delete`);
    
    if (ordersResponse.documents.length > 0) {
      const batchSize = 50;
      let deletedCount = 0;
      
      for (let i = 0; i < ordersResponse.documents.length; i += batchSize) {
        const batch = ordersResponse.documents.slice(i, i + batchSize);
        
        const deletePromises = batch.map(order => {
          return databases.deleteDocument(
            config.databaseId,
            config.collections.orders,
            order.$id
          );
        });
        
        await Promise.all(deletePromises);
        deletedCount += batch.length;
        log(`🗑️  Deleted ${deletedCount}/${ordersResponse.documents.length} orders...`);
      }
    }
    
    // Clean menu items
    try {
      const menuItemsResponse = await databases.listDocuments(
        config.databaseId,
        config.collections.menuItems,
        []
      );
      
      log(`📊 Found ${menuItemsResponse.documents.length} menu items to delete`);
      
      if (menuItemsResponse.documents.length > 0) {
        const batchSize = 50;
        let deletedCount = 0;
        
        for (let i = 0; i < menuItemsResponse.documents.length; i += batchSize) {
          const batch = menuItemsResponse.documents.slice(i, i + batchSize);
          
          const deletePromises = batch.map(item => {
            return databases.deleteDocument(
              config.databaseId,
              config.collections.menuItems,
              item.$id
            );
          });
          
          await Promise.all(deletePromises);
          deletedCount += batch.length;
          log(`🗑️  Deleted ${deletedCount}/${menuItemsResponse.documents.length} menu items...`);
        }
      }
    } catch (error) {
      log(`⚠️  Menu items collection not found or empty: ${error.message}`, 'warning');
    }
    
    // Clean categories
    try {
      const categoriesResponse = await databases.listDocuments(
        config.databaseId,
        config.collections.categories,
        []
      );
      
      log(`📊 Found ${categoriesResponse.documents.length} categories to delete`);
      
      if (categoriesResponse.documents.length > 0) {
        const batchSize = 50;
        let deletedCount = 0;
        
        for (let i = 0; i < categoriesResponse.documents.length; i += batchSize) {
          const batch = categoriesResponse.documents.slice(i, i + batchSize);
          
          const deletePromises = batch.map(category => {
            return databases.deleteDocument(
              config.databaseId,
              config.collections.categories,
              category.$id
            );
          });
          
          await Promise.all(deletePromises);
          deletedCount += batch.length;
          log(`🗑️  Deleted ${deletedCount}/${categoriesResponse.documents.length} categories...`);
        }
      }
    } catch (error) {
      log(`⚠️  Categories collection not found or empty: ${error.message}`, 'warning');
    }
    
    // Clean menus
    try {
      const menusResponse = await databases.listDocuments(
        config.databaseId,
        config.collections.menus,
        []
      );
      
      log(`📊 Found ${menusResponse.documents.length} menus to delete`);
      
      if (menusResponse.documents.length > 0) {
        const batchSize = 50;
        let deletedCount = 0;
        
        for (let i = 0; i < menusResponse.documents.length; i += batchSize) {
          const batch = menusResponse.documents.slice(i, i + batchSize);
          
          const deletePromises = batch.map(menu => {
            return databases.deleteDocument(
              config.databaseId,
              config.collections.menus,
              menu.$id
            );
          });
          
          await Promise.all(deletePromises);
          deletedCount += batch.length;
          log(`🗑️  Deleted ${deletedCount}/${menusResponse.documents.length} menus...`);
        }
      }
    } catch (error) {
      log(`⚠️  Menus collection not found or empty: ${error.message}`, 'warning');
    }
    
    log(`✅ Cleanup completed!`, 'success');
    
  } catch (error) {
    log(`❌ Error cleaning records: ${error.message}`, 'error');
    throw error;
  }
}

// Function to create sample orders
async function createSampleOrders() {
  log('📦 Creating sample orders...');
  
  try {
    // Get created students and vendors
    const studentsResponse = await databases.listDocuments(
      config.databaseId,
      config.collections.users,
      [
        // Query.equal('universityName', UNIVERSITY_NAME),
        // Query.equal('role', 'student')
      ]
    );
    const students = studentsResponse.documents.filter(doc => 
      doc.universityName === UNIVERSITY_NAME && doc.role === 'student'
    );
    
    const vendorsResponse = await databases.listDocuments(
      config.databaseId,
      config.collections.vendors,
      [
        // Query.equal('universityName', UNIVERSITY_NAME)
      ]
    );
    const vendors = vendorsResponse.documents.filter(doc => 
      doc.universityName === UNIVERSITY_NAME
    );
    
    if (students.length === 0 || vendors.length === 0) {
      log('⚠️  No students or vendors found. Please create them first.', 'warning');
      return;
    }
    
    log(`📊 Found ${students.length} students and ${vendors.length} vendors`);
    
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
      if (!items) return [];
      
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
    
    log(`📅 Generating orders from ${threeMonthsAgo.toLocaleDateString()} to ${now.toLocaleDateString()}`);
    
    // Create 200-300 orders spread across 3 months
    const totalOrders = Math.floor(Math.random() * 101) + 200; // 200-300 orders
    log(`🎯 Target orders: ${totalOrders}`);
    
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
      if (items.length === 0) continue;
      
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
        confirmedAt = baseConfirmedAt.toISOString();
        readyAt = baseReadyAt.toISOString();
        completedAt = baseCompletedAt.toISOString();
      } else if (statusRandom < 0.92) {
        // 4% ready orders (pending pickup)
        orderStatus = "ready";
        confirmedAt = baseConfirmedAt.toISOString();
        readyAt = baseReadyAt.toISOString();
        completedAt = null;
      } else if (statusRandom < 0.96) {
        // 4% confirmed orders (being prepared)
        orderStatus = "confirmed";
        confirmedAt = baseConfirmedAt.toISOString();
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
        userId: students[studentIndex].$id,
        vendorId: vendors[vendorIndex].$id,
        items: JSON.stringify(items),
        total: total,
        status: orderStatus,
        paymentMethod: Math.random() > 0.3 ? "Wallet" : "Cash", // 70% Wallet, 30% Cash
        confirmedAt: confirmedAt,
        readyAt: readyAt,
        completedAt: completedAt,
        cancelledAt: null,
        statusHistory: JSON.stringify([
          {
            status: "pending",
            timestamp: randomTime.toISOString(),
            updatedBy: students[studentIndex].$id,
            note: "Order placed"
          }
        ]),
        estimatedReadyTime: orderStatus === "pending" ? new Date(randomTime.getTime() + completionDelay).toISOString() : null,
        customerNote: Math.random() > 0.8 ? ["Please make it spicy", "No onions", "Extra crispy", "Light on salt"][Math.floor(Math.random() * 4)] : ""
      });
    }
    
    // Sort orders by creation time (using the implicit Appwrite creation time)
    log(`📦 Creating ${orders.length} orders with mixed statuses...`);
    
    // Create orders in Appwrite
    let createdCount = 0;
    for (const orderData of orders) {
      try {
        const orderId = ID.unique();
        
        await databases.createDocument(
          config.databaseId,
          config.collections.orders,
          orderId,
          {
            id: orderId,
            ...orderData
          }
        );
        
        createdCount++;
        if (createdCount % 25 === 0) {
          log(`✅ Created ${createdCount}/${orders.length} orders...`);
        }
      } catch (error) {
        log(`❌ Error creating order: ${error.message}`, 'error');
      }
    }
    
    log(`✅ All ${orders.length} orders created successfully!`, 'success');
    
    // Calculate and show statistics
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const walletOrders = orders.filter(o => o.paymentMethod === 'Wallet').length;
    const cashOrders = orders.filter(o => o.paymentMethod === 'Cash').length;
    
    // Status distribution
    const statusStats = {};
    orders.forEach(order => {
      statusStats[order.status] = (statusStats[order.status] || 0) + 1;
    });
    
    log(`📊 Order Statistics:`);
    log(`   💰 Total Revenue: ${totalRevenue} EGP`);
    log(`   💳 Wallet Orders: ${walletOrders} (${Math.round(walletOrders/orders.length*100)}%)`);
    log(`   💵 Cash Orders: ${cashOrders} (${Math.round(cashOrders/orders.length*100)}%)`);
    
    log(`📈 Order Status Distribution:`);
    Object.entries(statusStats).forEach(([status, count]) => {
      const percentage = Math.round(count/orders.length*100);
      const emoji = status === 'completed' ? '✅' : status === 'ready' ? '🍽️' : status === 'confirmed' ? '👨‍🍳' : '⏳';
      log(`   ${emoji} ${status.charAt(0).toUpperCase() + status.slice(1)}: ${count} orders (${percentage}%)`);
    });
    
    // Show vendor distribution
    const vendorStats = {};
    orders.forEach(order => {
      const vendorName = vendors.find(v => v.$id === order.vendorId)?.name || 'Unknown';
      vendorStats[vendorName] = (vendorStats[vendorName] || 0) + 1;
    });
    
    log(`🏪 Orders per Vendor:`);
    Object.entries(vendorStats).forEach(([name, count]) => {
      log(`   - ${name}: ${count} orders (${Math.round(count/orders.length*100)}%)`);
    });
    
  } catch (error) {
    log(`❌ Error creating sample orders: ${error.message}`, 'error');
    throw error;
  }
}

// Main setup function
async function setupDemoData() {
  log('🚀 Setting up demo data for Egypt University of Informatics (Appwrite)...');
  log('='.repeat(60));
  
  await createUniversity();
  await createDemoStudents();
  const vendors = await createDemoVendors();
  await createSampleOrders();
  
  log('\n✅ Demo data setup completed!', 'success');
  log('\n📊 Summary:');
  log('- University: Egypt University of Informatics');
  log('- Students: 5 demo accounts with Egyptian names');
  log('- Vendors: 3 Egyptian-themed vendors with separate menu structure');
  log('- Menus: Separate collections for menus, categories, and menu items');
  log('- Orders: 200-300 orders spread across last 3 months');
  log('- Status Mix: 88% completed, 4% ready, 4% confirmed, 4% pending');
  log('- Schedule: Sunday to Thursday, 9:15 AM to 3:30 PM only');
  log('- Timeline: All orders have realistic timestamps');
  log('\n🔐 Demo Student Login Credentials:');
  demoStudents.forEach(student => {
    console.log(`- ${student.email} / ${student.password} (${student.fullName})`);
  });
  log('\n🏪 Demo Vendor Login Credentials:');
  demoVendors.forEach(vendor => {
    console.log(`- ${vendor.email} / vendor123456 (${vendor.name})`);
  });
  
  process.exit(0);
}

// Main setup function with clean option
async function setupDemoDataWithCleanup() {
  log('🚀 Setting up demo data for Egypt University of Informatics (Appwrite with cleanup)...');
  log('='.repeat(60));
  
  // Clean existing orders and menu data first
  await cleanAllOrders();
  log('⏳ Waiting 2 seconds before creating new data...\n');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await createUniversity();
  await createDemoStudents();
  const vendors = await createDemoVendors();
  await createSampleOrders();
  
  log('\n✅ Demo data setup with cleanup completed!', 'success');
  log('\n📊 Summary:');
  log('- University: Egypt University of Informatics');
  log('- Students: 5 demo accounts with Egyptian names');
  log('- Vendors: 3 Egyptian-themed vendors with separate menu structure');
  log('- Menus: Separate collections for menus, categories, and menu items');
  log('- Orders: 200-300 orders spread across last 3 months');
  log('- Status Mix: 88% completed, 4% ready, 4% confirmed, 4% pending');
  log('- Schedule: Sunday to Thursday, 9:15 AM to 3:30 PM only');
  log('- Timeline: All orders have realistic timestamps');
  log('\n🔐 Demo Student Login Credentials:');
  demoStudents.forEach(student => {
    console.log(`- ${student.email} / ${student.password} (${student.fullName})`);
  });
  log('\n🏪 Demo Vendor Login Credentials:');
  demoVendors.forEach(vendor => {
    console.log(`- ${vendor.email} / vendor123456 (${vendor.name})`);
  });
  
  process.exit(0);
}

// Function to only clean orders and menu data (standalone)
async function runCleanupOnly() {
  log('🧹 Running orders and menu cleanup only...');
  log('='.repeat(40));
  
  await cleanAllOrders();
  
  log('\n✅ Orders and menu cleanup completed!', 'success');
  process.exit(0);
}

// Run the setup based on command line arguments
const args = process.argv.slice(2);
const command = args[0];

console.log('🎯 Available commands:');
console.log('  - node setup_demo_data_appwrite_comprehensive.cjs                  (create demo data)');
console.log('  - node setup_demo_data_appwrite_comprehensive.cjs clean            (setup with cleanup)');
console.log('  - node setup_demo_data_appwrite_comprehensive.cjs cleanup          (cleanup orders only)');
console.log('');

validateConfig();

switch(command) {
  case 'clean':
    setupDemoDataWithCleanup().catch((error) => {
      log(`❌ Script failed: ${error.message}`, 'error');
      process.exit(1);
    });
    break;
  case 'cleanup':
    runCleanupOnly().catch((error) => {
      log(`❌ Cleanup failed: ${error.message}`, 'error');
      process.exit(1);
    });
    break;
  default:
    setupDemoData().catch((error) => {
      log(`❌ Script failed: ${error.message}`, 'error');
      process.exit(1);
    });
    break;
}
