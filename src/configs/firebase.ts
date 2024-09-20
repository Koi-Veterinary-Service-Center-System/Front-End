// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdWYXl4tE3mlSMN0ZHAMjQSUXtkVmX_OU",
  authDomain: "swp391veterinary.firebaseapp.com",
  projectId: "swp391veterinary",
  storageBucket: "swp391veterinary.appspot.com",
  messagingSenderId: "238083275798",
  appId: "1:238083275798:web:e3c3df2082ec606974c937",
  measurementId: "G-HQP9Y12PED",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();
const auth = getAuth();

export { storage, googleProvider, auth };
