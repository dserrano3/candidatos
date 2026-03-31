import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// TODO: Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJJEZnStOKfOJJIizvSDTxEdMycDbH9A0",
  authDomain: "candidatos-e44f4.firebaseapp.com",
  projectId: "candidatos-e44f4",
  storageBucket: "candidatos-e44f4.firebasestorage.app",
  messagingSenderId: "839221978306",
  appId: "1:839221978306:web:bb8337095d8eca7716c75b",
  measurementId: "G-1H49DWL0M6"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app
