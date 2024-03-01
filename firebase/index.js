// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import "firebase/auth";

// please replace the firebaseConfig with yours
const firebaseConfig = {
  apiKey: "AIzaSyBP1lpOTs8q2USfQJ-cDSP9nVZeWdqBHx4",

  authDomain: "naikimessenger.firebaseapp.com",

  projectId: "naikimessenger",

  storageBucket: "naikimessenger.appspot.com",

  messagingSenderId: "245778150445",

  appId: "1:245778150445:web:ae8a5c55e6c945ac9e74a4",

  measurementId: "G-G1FHKGQEN3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const db = getFirestore(app);

export { app, db, auth };
