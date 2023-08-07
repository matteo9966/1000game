import {initializeApp} from 'firebase/app';
import {getFirestore,collection,getDocs} from 'firebase/firestore/lite'
const firebaseConfig = {
    apiKey: "AIzaSyCD9Z6ZIOib16pi_6Jr6MZQ1XQd_84hRW8",
    authDomain: "goals-database.firebaseapp.com",
    projectId: "goals-database",
    storageBucket: "goals-database.appspot.com",
    messagingSenderId: "183941279468",
    appId: "1:183941279468:web:5a4cc03933dac70cef3fc9"
  };
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

/*

/ all the calls are async

# to get  a collection: 
const todosCollection = collection(db,'todos');
const snapshot = await getDocs(todosCollection);

# to create a document use doc function:

cosnt game = doc(db,'dailySpecial/game');
const gameData  = { some:'data' , age:22 };
 
to write to a document you should use setDoc command
setDoc(game,gameData) // overwrites if exists
setDoc(game,gameData,{merge:true}) // to update the values
updateDoc(game,gameData) //throw error if exists

# add a document to a collection without knowing the id 

const newDoc = await addDoc(orderCollection,{
    customer:'matteo',
    drink:'latte',
    total:22
})

# read a single document
const mysnapshot = await getDoc(special) // object that has 

create a query 

const customerOrderQuery = query(
    collection(firestore,'orders'),
    where('drink','==','latte'),
    limit(20)
)

*/

