import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDlazpBn7xCUGK9kuqPTbOgLfzXN-ROvFQ",
  authDomain: "curaide-monitoring.firebaseapp.com",
  databaseURL: "https://curaide-monitoring-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "curaide-monitoring",
  storageBucket: "curaide-monitoring.firebasestorage.app",
  messagingSenderId: "924867592686",
  appId: "1:924867592686:web:87af3105fe393421d84eff"
};

// Initialize Firebase (Singleton pattern to prevent re-initialization)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth };