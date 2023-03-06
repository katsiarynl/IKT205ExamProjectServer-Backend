import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
//https://firebase.google.com/docs/database/web/start
const firebaseConfig = {
  apiKey: "AIzaSyDhnMMEDN9PRPmpwMNjZE-lklN5b19RjEA",
  authDomain: "studentfirebase-8c937.firebaseapp.com",
  projectId: "studentfirebase-8c937",
  storageBucket: "studentfirebase-8c937.appspot.com",
  messagingSenderId: "618125972867",
  appId: "1:618125972867:web:045e3cb90866f9f5d552b6",
  measurementId: "G-8Y29BN65XN",
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

export default db;
