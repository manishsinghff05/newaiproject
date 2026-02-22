import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "genwebai-837c8.firebaseapp.com",
  projectId: "genwebai-837c8",
  storageBucket: "genwebai-837c8.firebasestorage.app",
  messagingSenderId: "17357368101",
  appId: "1:17357368101:web:f4beb6055e91e441fbc8cc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };
