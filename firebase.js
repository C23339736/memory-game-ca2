import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyD-S615sdr_V7WaX5VH_V9iLT-L6FzrZ3k",
    authDomain: "memory-game-ca2.firebaseapp.com",
    projectId: "memory-game-ca2",
    storageBucket: "memory-game-ca2.firebasestorage.app",
    messagingSenderId: "172475843924",
    appId: "1:172475843924:web:f1d2c57925e437f08f34c1",
    measurementId: "G-SMHW7L3BVB"
};

// Connect to Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
