import {firestore} from 'firebase-admin';
import {FirebaseModel} from './FirestoreModel';
import {User} from '../../../interfaces/User.interface';
import {logger2} from '../../../logger/winston.logger';
import {firestoreDB} from '../../firebase/firebase';
import {DocumentReference, FieldValue} from 'firebase-admin/firestore';
import {Game} from '../../../interfaces/Game.interface';
import {Goal} from '../../../interfaces/Goal.interface';
import {ProposedGoal} from '../../../interfaces/ProposedGoal.interface';

/**
 * TODO: add a GAMESID collection with a list of empty documents with only the ids so you can avoid reading the whole document when reading
 */
/**
 * @description this is the Games model class,
 * this version uses the subcollection feature of firebase
 */
class GameFirebaseModel extends FirebaseModel {
  constructor(db: firestore.Firestore, name: string) {
    super(db, name);
  }

  private async insertGoalsBatch(goals: Goal[], gameDocRef: DocumentReference) {
    if (goals.length > 0) {
      const batch = this.db.batch();
      for (let goal of goals) {
        const goalRef = gameDocRef.collection('goals').doc(goal.id);
        batch.set(goalRef, goal);
      }
      await batch.commit();
    }
  }

  private async insertProposedGoalsBatch(
    proposedGoals: ProposedGoal[],
    gameDocRef: DocumentReference
  ) {
    const batch = this.db.batch();
    for (let goal of proposedGoals) {
      const goalRef = gameDocRef.collection('proposedGoals').doc(goal.id);
      batch.set(goalRef, goal);
    }
    await batch.commit();
  }

  /**
   * @description check if the game exists without dounloading the data just use the count
   * @param gameId
   * @returns
   */
  private async gameExists(gameId: string) {
    const gameDocRefCount = await this.collection
      .where('id', '==', gameId)
      .count()
      .get();
    return gameDocRefCount.data().count > 0;
  }

  /**
   * @description the game is added without goals and proposedGoals, these values are added
   * in sub collections and not as properties of a game object
   * @param game
   * @returns
   */
  async insertGame(game: Game) {
    try {
      const gameDocRef = this.collection.doc(game.id);
      const gameExists = await this.gameExists(game.id);
      if (gameExists) {
        return false;
      }
      await gameDocRef.set(game);
      await this.insertGoalsBatch(game.goals, gameDocRef);
      return true;
    } catch (error) {
      logger2(error, __filename);
      return false;
    }
  }

  async appendGoals(goals: Goal[], gameId: string) {
    const gameExists = await this.gameExists(gameId);
    if (!gameExists) {
      return false;
    }
    try {
      const gameDocRef = this.collection.doc(gameId);
      await this.insertGoalsBatch(goals, gameDocRef);
      return true;
    } catch (error) {
      logger2(error, __filename);
      return false;
    }
  }

  async appendProposedGoals(goals: ProposedGoal[], gameId: string) {
    const gameExists = await this.gameExists(gameId);
    if (!gameExists) {
      return false;
    }
    try {
      const gameRef = this.collection.doc(gameId);
      await this.insertProposedGoalsBatch(goals, gameRef);
      return true;
    } catch (error) {
      logger2(error, __filename);
      return false;
    }
  }

  async getGameById(gameId:string){
    const data = (await this.collection.doc(gameId).get()).data();
    if(!Boolean(data)) return null
    return data  
}


}

export const firestoreGameModel = new GameFirebaseModel(firestoreDB, 'Games');
