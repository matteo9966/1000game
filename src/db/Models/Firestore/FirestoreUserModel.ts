import { firestore } from "firebase-admin";
import { FirebaseModel } from "./FirestoreModel";
import { User } from "../../../interfaces/User.interface";
import { logger2 } from "../../../logger/winston.logger";
import { firestoreDB } from "../../firebase/firebase";

class UserFirebaseModel extends FirebaseModel {
    constructor(db: firestore.Firestore, name: string) {
      super(db, name);
    }
  
    async insertUser(user: User) {
      try {
        const result = await this.collection.doc(user.name).set(user);
        logger2(result, __filename);
        return true;
      } catch (error) {
        logger2(error, __filename);
        return false;
      }
    }
  }
  
  export const firestoreUserModel = new UserFirebaseModel(firestoreDB, 'Users');