// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXyKdbqFZShXruja8B93taSltKrEVcppw",
  authDomain: "chatmessaging-app-f9d62.firebaseapp.com",
  projectId: "chatmessaging-app-f9d62",
  storageBucket: "chatmessaging-app-f9d62.appspot.com",
  messagingSenderId: "268794229180",
  appId: "1:268794229180:web:4f52f3a798a8a8fbc6fbb9",
  measurementId: "G-CNF604VZXK"
};
//Initializations
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const auth = getAuth(app);

onAuthStateChanged(auth, user => {
  if (user != null) {
    console.log('Logged in!');
  } else {
    console.log('No user');
  }
});
export { app, firestore, analytics, auth };