import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDlazpBn7xCUGK9kuqPTbOgLfzXN-ROvFQ",
  authDomain: "curaide-monitoring.firebaseapp.com",
  databaseURL: "https://curaide-monitoring-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "curaide-monitoring",
  appId: "1:924867592686:web:87af3105fe393421d84eff"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getDatabase(app);