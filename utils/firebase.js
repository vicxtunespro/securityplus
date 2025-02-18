// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDfyaRaDJ-xGWisMW-Cuh8TLUGXtcgINIo",
  authDomain: "securityplus-2a8e7.firebaseapp.com",
  projectId: "securityplus-2a8e7",
  storageBucket: "securityplus-2a8e7.firebasestorage.app",
  messagingSenderId: "714532817755",
  appId: "1:714532817755:web:4a015f1bab8b4a0b11687e",
  measurementId: "G-DQPLWFTBQF"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const analytics = getAnalytics(app);
const db = getFirestore(app);

export {db}