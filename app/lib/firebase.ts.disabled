// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, enableNetwork } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Enable Firestore offline persistence for better performance
if (typeof window !== 'undefined') {
  enableNetwork(db).catch((error) => {
    console.warn('Failed to enable Firestore network:', error);
  });
}

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
