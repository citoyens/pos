// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');
importScripts('https://d27oa3wn4jstwu.cloudfront.net/index.iife.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: 'AIzaSyDTdEyWoW7e4cdHBk7kPqdBxZtk6snVe4M',
  authDomain: 'kitchen-display-prod.firebaseapp.com',
  databaseURL: 'https://kitchen-display-prod-default-rtdb.firebaseio.com',
  projectId: 'kitchen-display-prod',
  storageBucket: 'kitchen-display-prod.appspot.com',
  messagingSenderId: '258800880821',
  appId: '1:258800880821:web:46e1ea7bcd94e5a84ec2fc',
  measurementId: 'G-XBMG9D23TG',
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage(messaging, (payload) => {
  legologyHermes.default.HermesClient.incomingMessageCallback(payload, true);
});

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open('foodology-kitchen-pwa').then(function (cache) {
      return cache.addAll(['/']);
    }),
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    }),
  );
});
