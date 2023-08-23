import '../../../setEnv';

import { firestoreGameModelTests } from './FirestoreGameModel.test';
import { firestoreUserModelTests } from './FirestoreUserModel.test';


describe.only('firestore tests',()=>{
    firestoreUserModelTests();
    firestoreGameModelTests();
})