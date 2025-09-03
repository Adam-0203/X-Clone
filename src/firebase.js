// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCYAZ_uNlx_1jga4dRSxmHSlz5iYBqqEVI",
    authDomain: "xclone-e08b1.firebaseapp.com",
    projectId: "xclone-e08b1",
    storageBucket: "xclone-e08b1.firebasestorage.app",
    messagingSenderId: "297785248983",
    appId: "1:297785248983:web:252d5363ea71d97d65b492",
    measurementId: "G-NR2MG6W118"
  };

  
  

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }
