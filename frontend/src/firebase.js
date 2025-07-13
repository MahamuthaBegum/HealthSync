// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "healthsync-51a0c.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: "healthsync-51a0c.firebasestorage.app",
  messagingSenderId: "591775798396",
  appId: "1:591775798396:web:835f84902309ac9fe465f9",
  measurementId: "G-RHT187HFGM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const firestore = getFirestore(app);

export { auth, firestore };