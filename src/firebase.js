// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAemm71B8MdYVOZdOUmQyWAwa0z4hgVhyU",
  authDomain: "ticket-nen-bd.firebaseapp.com",
  projectId: "ticket-nen-bd",
  storageBucket: "ticket-nen-bd.firebasestorage.app",
  messagingSenderId: "785375554821",
  appId: "1:785375554821:web:1c0764ce4a842850e39b6c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Export the Auth instance
export const auth = getAuth(app);