import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import auth
import { getDatabase } from "firebase/database"; // Import Realtime Database


const firebaseConfig = {
  apiKey: "AIzaSyCs0LXQYzhcgJlEpMzR5vzvYfl-5-CtRaw",
  authDomain: "panto-eksamen2024.firebaseapp.com",
  databaseURL: "https://panto-eksamen2024-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "panto-eksamen2024",
  storageBucket: "panto-eksamen2024.appspot.com",
  messagingSenderId: "309668082272",
  appId: "1:309668082272:web:a9e8a5d198cae3d0768905",
};

// Initialize Firebase only if it hasn't been initialized
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase services
const auth = getAuth(app); // Initialize auth
const database = getDatabase(app); // Initialize Realtime Database


export { auth, database}; // Export all services
