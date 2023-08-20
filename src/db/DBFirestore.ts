import * as firestore from 'firebase-admin/firestore';
import {firestoreDB} from './firebase/firebase';
import {logger2} from '../logger/winston.logger';
import {User} from '../interfaces/User.interface';

class FirebaseModel {
  private _db!: firestore.Firestore;
  private _collection!: firestore.CollectionReference;
  constructor(db: firestore.Firestore, name: string) {
    this._db = db;
    this._collection = this._db.collection(name); // i get a reference to the collection
  }


  protected get db() {
    return this._db;
  }
  protected get collection() {
    return this._collection;
  }
}

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
