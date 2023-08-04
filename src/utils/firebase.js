import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore/lite';
import { getAuth } from 'firebase/auth';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBvHSfJVqrup4O5EGclCACl8kFuFuOJ-80",
  authDomain: "wiwaha-2f25b.firebaseapp.com",
  projectId: "wiwaha-2f25b",
  storageBucket: "wiwaha-2f25b.appspot.com",
  messagingSenderId: "989442197314",
  appId: "1:989442197314:web:e0b1d44f93ea8224cf6adb",
  measurementId: "G-RFBREJQH6G"
};

const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
export const storage = getStorage();
