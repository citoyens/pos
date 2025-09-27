// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);
importScripts("https://d27oa3wn4jstwu.cloudfront.net/index.iife.js");

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyCgFUBNd7gj_4CSgBejOmxb0u2yBlTH_Ts",
  authDomain: "remote-config-stg.firebaseapp.com",
  databaseURL: "https://remote-config-stg-default-rtdb.firebaseio.com",
  projectId: "remote-config-stg",
  storageBucket: "remote-config-stg.appspot.com",
  messagingSenderId: "1075222556666",
  appId: "1:1075222556666:web:93d23b76f5f49318c27e43",
  measurementId: "G-SD4C1KYN32",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage(messaging, (payload) => {
  legologyHermes.default.HermesClient.incomingMessageCallback(payload, true);
});

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open("foodology-kitchen-pwa").then(function (cache) {
      return cache.addAll(["/"]);
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});
