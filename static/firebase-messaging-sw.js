importScripts('https://www.gstatic.com/firebasejs/7.20.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/7.20.0/firebase-messaging.js')
firebase.initializeApp({
  apiKey: 'AIzaSyA0aZ5SDB0PDJL_vqcIMH9sqUM-J4AKnQs',
  authDomain: 'tenis-plus.firebaseapp.com',
  databaseURL: 'tenis-plus.firebaseapp.com',
  projectId: 'tenis-plus',
  storageBucket: 'tenis-plus.appspot.com',
  messagingSenderId: '409141565924',
  appId: '1:409141565924:web:6c8ea405e53288e1220ff1',
  measurementId: 'G-7P6403JMYE',
})

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging()

// Setup event listeners for actions provided in the config:
self.addEventListener('notificationclick', function (e) {
  const notification = e.notification
  const action = e.action

  switch (action) {
    case 'open':
      clients.openWindow(notification.data.FCM_MSG.data.url)
      break
  }

  notification.close()
})
