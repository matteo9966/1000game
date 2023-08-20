import {expect} from 'chai';
import {firestoreUserModel} from './FirestoreUserModel';
import {firestoreDB} from '../../firebase/firebase';
import * as superagent from 'superagent';
import {User} from '../../../interfaces/User.interface';
async function clearFirestore() {
  const endpoint =
    'http://localhost:8080/emulator/v1/projects/goals-database/databases/(default)/documents';

  try {
    const response = await superagent.delete(endpoint);
    if (response.ok) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}


async function getAllUsers(){
    const snapshot = await firestoreDB.collection('Users').get()
    return snapshot.docs.map(doc => doc.data());
}


export function firestoreUserModelTests(){
    
    describe.only('FIRESTORE UserModel', () => {
      async function setup() {
        return clearFirestore();
      }
    
      it('should clear the firestore database and there should not be any data', async () => {
        const ok = await setup();
        expect(ok).to.be.true;
        const collectionlist = await getAllUsers();
        console.log(collectionlist)
        expect(collectionlist.length).to.eq(0);
      });
    
      it('should add a user to the firestore databae and there should be only one user in the Users collection', async () => {
        await setup();
        const user: User = {
          gameID: 'some-game-id',
          goals: [],
          id: 'userid',
          name: 'random-username',
          password: 'some-random-password',
          proposed: [],
          role: 'admin',
          tempPassword: 'some-temp-password',
        };
        const result = await firestoreUserModel.insertUser(user);
        expect(result).to.be.true;
        const userindb = await firestoreDB.collection('Users').doc(user.name).get();
        expect(userindb.exists).to.be.true;
      });
    });

}
