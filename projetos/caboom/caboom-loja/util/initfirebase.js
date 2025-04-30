import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { GoogleAuthProvider } from "firebase/auth";
import { getFunctions } from "firebase/functions";
var firebaseConfig = {
  apiKey: "AIzaSyAqbIK5J234MBLp8QsVu9jIAns4UjIoJRA",
  authDomain: "projconexaoafro.firebaseapp.com",
  projectId: "projconexaoafro",
  storageBucket: "projconexaoafro.appspot.com",
  messagingSenderId: "821224477850",
  appId: "1:821224477850:web:73a663e1997897d756fb23",
  measurementId: "G-3P73GF0N6B",
};
import { getApp } from "firebase/app";

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
auth.languageCode = "it";
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const provider = new GoogleAuthProvider();
const functions = getFunctions(getApp(), "us-central1");
export { db, auth, storage, provider, functions };
