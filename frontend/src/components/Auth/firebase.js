// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
     apiKey: "AIzaSyD3bfIJUTcRCespMn6mcTkRxNxP3ONnRPE",
     authDomain: "ecommerce-d7187.firebaseapp.com",
     projectId: "ecommerce-d7187",
     storageBucket: "ecommerce-d7187.firebasestorage.app",
     messagingSenderId: "535886607317",
     appId: "1:535886607317:web:252d10d602448bb76e435c",
     measurementId: "G-SRFV5NNCK6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier, signInWithPhoneNumber };