import {firestore} from 'firebase-admin';
import {FirebaseModel} from './FirestoreModel';
import {User} from '../../../interfaces/User.interface';
import {logger2} from '../../../logger/winston.logger';
import {firestoreDB} from '../../firebase/firebase';
import {DocumentReference, FieldValue} from 'firebase-admin/firestore';
import {Game, GameLookupPlayers} from '../../../interfaces/Game.interface';
import {Goal} from '../../../interfaces/Goal.interface';
import {ProposedGoal} from '../../../interfaces/ProposedGoal.interface';
import {firestoreUserModel} from './FirestoreUserModel';

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

  async getGameById(gameId: string) {
    const data = (await this.collection.doc(gameId).get()).data();
    if (!Boolean(data)) return null;
    return data as Game;
  }

  async getGameByIdLookupPlayers(gameId: string) {
    try {
      const game = await this.getGameById(gameId);
      if (!game) return null;
      const players = game.players;
      let playerList: Omit<User, 'password'>[] = [];
      for (let username of players) {
        const player = await firestoreUserModel.getUser(username);
        if (!player) {
          continue;
        }
        const {password, ...playerNoPass} = player;
        playerList.push(playerNoPass);
      }
      const proposedGoalsRef = this.collection
        .doc(gameId)
        .collection('proposedGoals');
      const goalsRef = this.collection.doc(gameId).collection('goals');

      const proposedGoalsData = (await proposedGoalsRef.get()).docs.map(d =>
        d.data()
      ) as ProposedGoal[];
      const goals = (await goalsRef.get()).docs.map(d => d.data()) as Goal[];
      const lookupGame: GameLookupPlayers = {
        ...game,
        players: playerList,
        proposedGoals: proposedGoalsData || [],
        goals: goals || [],
      };
      return lookupGame;
    } catch (error) {
      logger2(error, __filename);
      return null;
    }
  }

  async insertPlayer(gameId: string, playerId: string) {
    try {
      await this.collection
        .doc(gameId)
        .update({players: FieldValue.arrayUnion(playerId)});
      return true;
    } catch (error) {
      logger2(error, __filename);
      return false;
    }
  }

  async upvoteProposedGoal(gameId: string, goalId: string, username: string) {
    try {
      const proposedGoalRef = this.collection
        .doc(gameId)
        .collection('proposedGoals')
        .doc(goalId);
      const proposedGoal = await proposedGoalRef.get();
      if (!proposedGoal.exists) {
        throw new Error(`Game ${gameId} proposedGoal ${goalId} does not exist`);
      }
      await proposedGoalRef.update({votedBy: FieldValue.arrayUnion(username)});
      return true;
    } catch (error) {
      logger2(error, __filename);
      return false;
    }
  }

  async deleteProposedGoalByGoalId(gameId: string, goalId: string) {
    try {
      const proposedGoalRef = this.collection
        .doc(gameId)
        .collection('proposedGoals')
        .doc(goalId);

      await proposedGoalRef.delete({ exists: true });
      return true;
    } catch (error) {
      logger2(error, __filename);
      return false;
    }
  }

  async removeUsernameFromProposedGoalUserUpvoteList(
    gameId: string,
    goalId: string,
    username: string
  ) {
    try {
      const proposedGoalRef = this.collection
        .doc(gameId)
        .collection('proposedGoals')
        .doc(goalId);

      await proposedGoalRef.update({votedBy: FieldValue.arrayRemove(username)});
      return true;
    } catch (error) {
      logger2(error, __filename);
      return false;
    }
  }
}

export const firestoreGameModel = new GameFirebaseModel(firestoreDB, 'Games');
