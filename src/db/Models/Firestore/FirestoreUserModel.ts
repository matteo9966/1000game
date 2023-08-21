import {firestore} from 'firebase-admin';
import {FirebaseModel} from './FirestoreModel';
import {User} from '../../../interfaces/User.interface';
import {logger2} from '../../../logger/winston.logger';
import {firestoreDB} from '../../firebase/firebase';
import {FieldValue} from 'firebase-admin/firestore';

class UserFirebaseModel extends FirebaseModel {
  constructor(db: firestore.Firestore, name: string) {
    super(db, name);
  }

  async insertUser(user: User) {
    try {

      const transactionResult = await this.db.runTransaction(async (transaction)=>{
        try {
          const userDocRef = this.collection
          .doc(user.name);
          const document = await transaction.get(userDocRef)
          if(document.exists){
            return false
          }
         const transactionInstance =  transaction.set(userDocRef,user);
         return true 
        } catch (error) {
          return false
        }

      })

      // const result = await this.collection
      //   .doc(user.name)
      //   .set(user, {merge: false});
      // logger2(transactionResult, __filename);
      return transactionResult;
    } catch (error) {
      logger2(error, __filename);
      return false;
    }
  }

  /**
   * @description when user creates a game it adds the id to the user
   * @param username
   * @param gameId
   */
  async addGameIdToUser(username: string, gameId: string) {
    try {
      const result = await this.collection
        .doc(username)
        .update({gameID: gameId});
      logger2(result, __filename);
      return true;
    } catch (error) {
      logger2(error, __filename);
      return false;
    }
  }

  async addGoalIdToUser(username: string, goalId: string) {
    try {
      const result = await this.collection.doc(username).update(
        {
          goals: FieldValue.arrayUnion(goalId),
        }
      );
      logger2(result, __filename);
      return true;
    } catch (error) {
      logger2(error, __filename);
      return false;
    }
  }

  /**
   * @description provide the goalId and the username, removes the goalId from the goals array
   * @param username
   * @param goalId
   */
  async removeGoalFormUser(username: string, goalId: string) {
    try {
      const result = await this.collection.doc(username).update(
        {
          goals: FieldValue.arrayRemove(goalId),
        }
      );
      return true;
    } catch (error) {
      logger2(error, __filename);
      return false;
    }
  }

  async changeUserPassword(username: string, password: string) {
    try {
      const result = await this.collection.doc(username).update(
        {
          password: password,
        }
      );
      return true;
    } catch (error) {
      logger2(error, __filename);
      return false;
    }
  }

  async removeTempPassword(username: string) {
    try {
      const result = await this.collection.doc(username).update(
        {
          tempPassword: null,
        }
      );
      return true;
    } catch (error) {
      logger2(error, __filename);
      return false;
    }
  }
}

export const firestoreUserModel = new UserFirebaseModel(firestoreDB, 'Users');
