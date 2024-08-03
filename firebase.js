import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC2DVBgmrPqb_ou6snvl1fxPl8K8LH5sH4",
  authDomain: "react-notes-cce51.firebaseapp.com",
  projectId: "react-notes-cce51",
  storageBucket: "react-notes-cce51.appspot.com",
  messagingSenderId: "1046002418977",
  appId: "1:1046002418977:web:fa3b1d22c73f31c55d2a60"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const notesCollection = collection(db,"notes")