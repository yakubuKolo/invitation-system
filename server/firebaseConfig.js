import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyCiHjE8gQuDtt9PLUvdVGSXzvS-wl0icsc",
    authDomain: "occasion-craft.firebaseapp.com",
    projectId: "occasion-craft",
    storageBucket: "occasion-craft.appspot.com",
    messagingSenderId: "785699300174",
    appId: "1:785699300174:web:20bfaf6d0b9300dccc341f"
};
console.log("LOADED --> ")

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export const signInWithGoogle = () => {
    signInWithPopup(auth, provider).then((responsse) => {
        console.log("LOGGED IN USER --> ", responsse)
    }).catch((error) => console.log("ERROR SIGNING IN -->", error))
}