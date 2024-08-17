// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrViQrzwKByMDtjVgBmbqFnQElLOKLkBI",
  authDomain: "ecommerce-app-2214b.firebaseapp.com",
  projectId: "ecommerce-app-2214b",
  storageBucket: "ecommerce-app-2214b.appspot.com",
  messagingSenderId: "80403755004",
  appId: "1:80403755004:web:eb2b4027f72797228f0c79",
  measurementId: "G-QYF5XYLY0D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);