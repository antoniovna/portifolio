import "firebase/analytics";
import "firebase/storage";

require("firebase/functions");
var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");
require("firebase/storage");

var firebaseConfig = {
  apiKey: "AIzaSyAqbIK5J234MBLp8QsVu9jIAns4UjIoJRA",
  authDomain: "projconexaoafro.firebaseapp.com",
  projectId: "projconexaoafro",
  storageBucket: "projconexaoafro.appspot.com",
  messagingSenderId: "821224477850",
  appId: "1:821224477850:web:73a663e1997897d756fb23",
  measurementId: "G-3P73GF0N6B",
};
// Initialize Firebase
firebase.default.initializeApp(firebaseConfig);
firebase.default.auth();
firebase.default.analytics();
firebase.default.storage();

export default !firebase.default.apps.length
  ? firebase.default.initializeApp(firebaseConfig)
  : firebase.default.app();
