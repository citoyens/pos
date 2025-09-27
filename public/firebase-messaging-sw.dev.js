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
  apiKey: 'AIzaSyCbj-l1tFgYh5TuC_KwvPPMBAk0qVBbfvA',
  authDomain: 'kitchen-display-dev.firebaseapp.com',
  projectId: 'kitchen-display-dev',
  storageBucket: 'kitchen-display-dev.appspot.com',
  messagingSenderId: '76311568079',
  appId: '1:76311568079:web:f440d81bebb89c4cc5a1ba',
  measurementId: 'G-K7K649X17V',
  databaseURL: 'https://kitchen-display-dev-default-rtdb.firebaseio.com',
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
