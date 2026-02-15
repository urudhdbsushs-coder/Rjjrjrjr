
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAnaGdTdQt1ED6XQU4LBmPx4NvbyMVR11w",
  authDomain: "admin-c1d25.firebaseapp.com",
  projectId: "admin-c1d25",
  storageBucket: "admin-c1d25.firebasestorage.app",
  messagingSenderId: "516508991759",
  appId: "1:516508991759:web:76d72c8a8984bcfb037e7a",
  measurementId: "G-MGB1SLJFN5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
