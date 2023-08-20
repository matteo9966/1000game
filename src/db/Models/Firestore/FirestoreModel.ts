import * as firestore from 'firebase-admin/firestore';
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
  
  export {FirebaseModel}