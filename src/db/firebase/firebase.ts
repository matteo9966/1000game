// Import the functions you need from the SDKs you need
import * as admin from "firebase-admin";
import * as firestore from "firebase-admin/firestore";
import * as goal_database_key from './goals-database-firebase-adminsdk-5g0pg-31ce41ff6b.json';
import { environment } from "../../config/environment";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCD9Z6ZIOib16pi_6Jr6MZQ1XQd_84hRW8",
//   authDomain: "goals-database.firebaseapp.com",
//   projectId: "goals-database",
//   storageBucket: "goals-database.appspot.com",
//   messagingSenderId: "183941279468",
//   appId: "1:183941279468:web:5a4cc03933dac70cef3fc9"
// };

// Initialize Firebase
console.log(`|\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\|
process.env.FIRESTORE_EMULATOR_HOST is:
 ${process.env.FIRESTORE_EMULATOR_HOST}
|\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\|`)
export function initializeFirestore(){
    
    if(admin.apps.length>0){
        console.log('APP ALREADY INITIALIZED!')
      const app =  admin.apps[0]!;
      return firestore.getFirestore(app);
    }

    const app = admin.initializeApp({
        credential:admin.credential.cert(environment.firebase_config as any),
        projectId:'goals-database',

    })
    console.log('INITIALIZED THE FIRESTORE')
    const db = firestore.getFirestore(app);
    
   return db;
}

export const firestoreDB = initializeFirestore();