// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDzBbcMUHBs_pc1mbfwobGW7KJgyDKmQIE",
    authDomain: "mj36-7e65e.firebaseapp.com",
    databaseURL: "https://mj36-7e65e-default-rtdb.firebaseio.com",
    projectId: "mj36-7e65e",
    storageBucket: "mj36-7e65e.firebasestorage.app",
    messagingSenderId: "64103654826",
    appId: "1:64103654826:web:c7dcd0e9af6466e67137d3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
    console.log('Received background message ', payload);
    
    const notificationTitle = payload.notification.title || 'FC Wolves';
    const notificationOptions = {
        body: payload.notification.body || 'إشعار جديد من فريق الذئاب',
        icon: '/icon.png',
        badge: '/icon.png',
        tag: 'fc-wolves-notification',
        data: payload.data || {}
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', function(event) {
    console.log('Notification click received.');
    
    event.notification.close();
    
    // Open the app
    event.waitUntil(
        clients.openWindow('/')
    );
});

