import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

// configure firebase
const firebaseConfig = {
    apiKey: "AIzaSyAf5qLPF1G6fig39ES6QnMyFhNvCUe_bps",
    authDomain: "shoutout-46a59.firebaseapp.com",
    projectId: "shoutout-46a59",
    storageBucket: "shoutout-46a59.appspot.com",
    messagingSenderId: "346786330316",
    appId: "1:346786330316:web:81396241877155927ff469",
    measurementId: "G-4ZNG9EDPQS"
}

// generate id
export const uniqueID = () => {
    const randNum = Math.floor(Math.random() * Date.now())
    const randText =  Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);

    return `${randNum}-${randText}`
}

// initialize firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

// initialize firestore
export const db = getFirestore(app)

export default db