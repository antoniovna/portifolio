import 'firebase/analytics';
import 'firebase/storage';

require('firebase/functions');
var firebase = require('firebase/app');
require('firebase/auth');
require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDD1kmJ4q9E0Roa7YXOSn05vO6o3VyRW4E",
  authDomain: "safira-90efb.firebaseapp.com",
  projectId: "safira-90efb",
  storageBucket: "safira-90efb.appspot.com",
  messagingSenderId: "650181695106",
  appId: "1:650181695106:web:0002b690b810b2dd36469b",
  measurementId: "G-S3J2BG8QYZ"
};
// Initialize Firebase
firebase.default.initializeApp(firebaseConfig)
firebase.default.auth()
firebase.default.analytics();

export default !firebase.default.apps.length ? firebase.default.initializeApp(firebaseConfig) : firebase.default.app();
