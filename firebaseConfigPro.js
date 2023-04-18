// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDiz7fA00qI070pkTjs8lNQRo6vtQx8YhQ",
  authDomain: "cooktogo-cec09.firebaseapp.com",
  projectId: "cooktogo-cec09",
  storageBucket: "cooktogo-cec09.appspot.com",
  messagingSenderId: "724932999085",
  appId: "1:724932999085:web:1ff130e8ba459c33b99324",
  measurementId: "G-CRBWN28NY1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
