/**
 * Firebase Configuration for Elite IT Portal
 * Replace the placeholders below with your actual Firebase project settings.
 * You can find these in the Firebase Console (Project Settings > General > Your apps).
 */

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// VAPID Key for Web Push (found in Firebase Console > Project Settings > Cloud Messaging > Web configuration)
const VAPID_KEY = "YOUR_PUBLIC_VAPID_KEY";

// Initialize Firebase (Compat)
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();
    window.messaging = messaging;
}

if (typeof window !== 'undefined') {
    window.firebaseConfig = firebaseConfig;
    window.VAPID_KEY = VAPID_KEY;
}
