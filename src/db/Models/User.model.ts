import {Game} from '../../interfaces/Game.interface';
import {Goal} from '../../interfaces/Goal.interface';
import { User } from '../../interfaces/User.interface';
import {DB, dbClient} from '../DB';
import {Model} from './Model';

class UserModel extends Model {
  constructor(db: DB, name: string) {
    super(db, name);
    // this.appendGoals = this.appendGoals.bind(this)
    // this.appendProposedGoals = this.appendProposedGoals.bind(this)
  }

  insertUser(user:User){
    return this.insert(`/${user.id}`,user);
  }

//   insertGame(game: Game) {
//     return this.insert(`/${game.id}`, game);
//   }

//   appendGoals(goals: Goal[], gameId: string) {
//     return this.insert(`/${gameId}/goals`, goals, false);
//   }

//   appendProposedGoals(goals: Goal[], gameId: string) {
//     return this.insert(`/${gameId}/proposedGoals`, goals, false);
//   }

//   getGameById(gameId: string) {
//     return this.get(`/${gameId}`) as Promise<Game>;
//   }

}

export const userModel = dbClient.createModel<UserModel>(UserModel, 'Users');

// export type appendGoalType = typeof UserModel.appendGoals