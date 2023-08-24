import '../../../setEnv';

import { firestoreGameModelTests } from './FirestoreGameModel.test';
import { firestoreUserModelTests } from './FirestoreUserModel.test';


describe('firestore tests',()=>{
    firestoreUserModelTests();
    firestoreGameModelTests();
})