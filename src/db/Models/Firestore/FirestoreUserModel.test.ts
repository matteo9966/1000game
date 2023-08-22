import {expect} from 'chai';
import {firestoreUserModel} from './FirestoreUserModel';
import {firestoreDB} from '../../firebase/firebase';
import * as superagent from 'superagent';
import {User} from '../../../interfaces/User.interface';
const mockUser: User = {
  gameID: '',
  goals: [],
  id: 'userid',
  name: 'random-username',
  password: 'some-random-password',
  proposed: [],
  role: 'admin',
  tempPassword: 'some-temp-password',
};
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

async function getAllUsers() {
  const snapshot = await firestoreDB.collection('Users').get();
  return snapshot.docs.map(doc => doc.data());
}

export function firestoreUserModelTests() {
  describe('FIRESTORE UserModel', () => {
    // clear the firestore after all the tests
    after(async () => {
      await clearFirestore();
    });
    async function setup() {
      return clearFirestore();
    }

    describe('setup function', () => {
      it('should clear the firestore database and there should not be any data', async () => {
        const ok = await setup();
        expect(ok).to.be.true;
        const collectionlist = await getAllUsers();
        console.log(collectionlist);
        expect(collectionlist.length).to.eq(0);
      });
    });

    describe('insertUser', () => {
      it('should add a user to the firestore databae and there should be only one user in the Users collection', async () => {
        await setup();
        const user = {...mockUser};
        const result = await firestoreUserModel.insertUser(user);
        expect(result).to.be.true;
        const userindb = await firestoreDB
          .collection('Users')
          .doc(user.name)
          .get();
        expect(userindb.exists).to.be.true;
      });

      it('should return false if trying to insert a user with a username that already exists', async () => {
        await setup();
        const user = {...mockUser};
        const result = await firestoreUserModel.insertUser(user);
        expect(result, 'inserting fresh user should be true').to.be.true;
        const user2 = {...user,tempPassword:'dont-know-really'}
        const result2 = await firestoreUserModel.insertUser(user2);
        expect(result2, 'inserting a user with the same id should be false').to
          .be.false;
        const collection = await getAllUsers();
        expect(collection.length).to.eq(1);
      });
    });

    describe('addGameIdToUser', () => {
      it('should update a user with a game id', async () => {
       const cleared =  await setup();
       console.log('CLEARED DB : ,',cleared);
        const gameID = 'gameID-for-the-user';
        const user = {...mockUser};
        await firestoreUserModel.insertUser(user);
        const result = await firestoreUserModel.addGameIdToUser(
          user.name,
          gameID
        );
        expect(result,'the updated result should be true after adding the game id to user').to.be.true;
        const userDocument = await firestoreDB
          .collection('Users')
          .doc(user.name)
          .get();

        const userData = userDocument.data() as User;
        const userGameID = userData.gameID;
        expect(
          userGameID,
          'the updated user document should contain the new gameID'
        ).to.eq(gameID);
      });

      it('should not update a username that does not exist', async () => {
        await setup();
        const gameID = 'gameID-for-no-user';
        const result = await firestoreUserModel.addGameIdToUser(
          'non-existing-user',
          gameID
        );
        expect(result).to.be.false;
      });
    });

    describe('addGoalIdToUser', () => {
      it('should add a goalId to an existing user', async () => {
        await setup();
        const user = {...mockUser};
        const goalID = 'some-goal-id';
        await firestoreUserModel.insertUser(user);
        const result = await firestoreUserModel.addGoalIdToUser(
          user.name,
          goalID
        );
        expect(result).to.be.true;
        const users = await getAllUsers();
        const userWithGoal = users[0] as User;
        expect(userWithGoal.goals).to.contain(goalID);
      });
      it('should return false if there is no user with the id', async () => {
        await setup();
        const result = await firestoreUserModel.addGoalIdToUser(
          'non-existing',
          'some-randomid'
        );
        expect(result).to.be.false;
      });
    });

    describe('removeGoalFromUser', () => {
      it('should remove the goal from a user that exists and has the goalId', async () => {
        await setup();
        const user: User = {...mockUser, goals: []};
        const goalID = 'some-random-goal-id';
        user.goals.push(goalID);
        await firestoreUserModel.insertUser(user);
        const result = await firestoreUserModel.removeGoalFormUser(
          user.name,
          goalID
        );
        expect(result).to.be.true;
        const users = await getAllUsers();
        const updatedUSer = users[0] as User;
        expect(updatedUSer.goals).to.not.contain(goalID);
      });

      it('should return false if trying to remove a goal from a non existing user', async () => {
        await setup();
        const result = await firestoreUserModel.removeGoalFormUser(
          'non-existing-user',
          'non-existing-goal'
        );
        expect(result).to.be.false;
      });
      it('should return the user unchanged if the user does not contain the goalId', async () => {
        await setup();
        const user: User = {...mockUser, goals: []};
        const goalID = 'some-random-goal-id';
        const nonExistingGoalId = 'non-existing-id';
        user.goals.push(goalID);
        await firestoreUserModel.insertUser(user);
        const result = await firestoreUserModel.removeGoalFormUser(
          user.name,
          nonExistingGoalId
        );
        expect(result).to.be.true;
        const users = await getAllUsers();
        const updatedUSer = users[0] as User;
        expect(updatedUSer).to.deep.equal(user);
      });
    });

    describe('changeUserPassword', () => {
      it('should update the users password', async () => {
        await setup();
        const user = {...mockUser};
        await firestoreUserModel.insertUser(user);
        const password = 'some-super-secret-password';
        const result = await firestoreUserModel.changeUserPassword(
          user.name,
          password
        );
        expect(result).to.be.true;
        const users = await getAllUsers();
        const updatedUser = users[0] as User;
        expect(updatedUser.password).to.eq(password);
      });
      it('should return false if the user is not in the db', async () => {
        await setup();
        const result = await firestoreUserModel.changeUserPassword(
          'non-existing-user',
          'fake-pass'
        );
        expect(result).to.be.false;
      });
    });

    describe('removeTempPassword', () => {
      it('should remove the tempPassword of a user', async () => {
        await setup();
        const user = {
          ...mockUser,
          tempPassword: 'some-temp-password-to-remove',
        };
        await firestoreUserModel.insertUser(user);
        const result = await firestoreUserModel.removeTempPassword(user.name);
        expect(result).to.be.true;
        const users = await getAllUsers();
        const updatedUSer = users[0];
        const tempPassword = updatedUSer.tempPassword;
        expect(tempPassword).to.be.null;
      });
      it('should return false if the user does not exist', async () => {
        await setup();
        const result = await firestoreUserModel.removeTempPassword(
          'some-random-id'
        );
        expect(result).to.be.false;
      });
    });
  });
}
