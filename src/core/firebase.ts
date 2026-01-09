
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, Timestamp } from "firebase/firestore";

// TODO: User needs to provide these values in .env or manual config
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY_HERE",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const dbStore = getFirestore(app);

// Authentication Logic
export const authenticateSilently = (): Promise<User> => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("Firebase: Silently authenticated as", user.uid);
                resolve(user);
                unsubscribe();
            } else {
                console.log("Firebase: Attempting anonymous sign-in...");
                signInAnonymously(auth)
                    .then(({ user }) => {
                        resolve(user);
                        unsubscribe();
                    })
                    .catch((error) => {
                        console.error("Firebase Auth Error:", error);
                        reject(error);
                    });
            }
        });
    });
};

export { auth, dbStore };
