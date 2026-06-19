import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCLBe69rkiZtMWI8os6n5VabBN3XrTbXlU",
  authDomain: "jobify-33b2d.firebaseapp.com",
  projectId: "jobify-33b2d",
  storageBucket: "jobify-33b2d.firebasestorage.app",
  messagingSenderId: "774197738089",
  appId: "1:774197738089:web:5a313ed1f00930d35140f8",
  measurementId: "G-4QTVYYZM4W"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)