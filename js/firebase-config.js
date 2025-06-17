// Firebase Configuration - New Project
const firebaseConfig = {
  apiKey: "AIzaSyBUip9Y8Bo2Mp526aYvRAamFFmmzcDkKW0",
  authDomain: "fc-wolves-team-app.firebaseapp.com",
  databaseURL: "https://fc-wolves-team-app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fc-wolves-team-app",
  storageBucket: "fc-wolves-team-app.firebasestorage.app",
  messagingSenderId: "21060232227",
  appId: "1:21060232227:web:fc79467f3d299e070e7d96"
};

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, set, get, push, onValue, remove, update } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';
import { getMessaging, getToken, onMessage } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js';

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);

// Export Firebase functions
export { ref, set, get, push, onValue, remove, update, storageRef, uploadBytes, getDownloadURL, deleteObject, getToken, onMessage };

console.log('🔥 Firebase initialized successfully for FC Wolves Legendary!');


