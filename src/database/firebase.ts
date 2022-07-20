// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { GoogleAuthProvider } from "firebase/auth";



const firebaseConfig = {
  apiKey: 'AIzaSyAStJCaI-NlxZufpRC-eiaGxTbDsOCETgk',
  authDomain: 'moneylee.firebaseapp.com',
  projectId: 'moneylee',
  storageBucket: 'moneylee.appspot.com',
  messagingSenderId: '288288661557',
  appId: '1:288288661557:web:a6f75c19c60d2a1d36917c',
};

const provider = new GoogleAuthProvider();

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { app, db, provider };
