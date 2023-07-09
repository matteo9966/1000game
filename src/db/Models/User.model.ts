import { basename } from 'path';
import { CustomServerError } from '../../errors/CustomServerError';
import {Game} from '../../interfaces/Game.interface';
import {Goal} from '../../interfaces/Goal.interface';
import { User } from '../../interfaces/User.interface';
import { logger2 } from '../../logger/winston.logger';
import {DB, dbClient} from '../DB';
import {Model} from './Model';

class UserModel extends Model {
  constructor(db: DB, name: string) {
    super(db, name);
    // this.appendGoals = this.appendGoals.bind(this)
    // this.appendProposedGoals = this.appendProposedGoals.bind(this)
  }

  async insertUser(user:User){
    let users;
    try {
      users = await this.get<Record<string,User>>('');
    } catch (error) {
      users = {};
    }

    if(!users || !(Object.keys(users).includes(user.name))){
       console.log("inserted user:",user)
       return this.insert(`/${user.name}`,user);

    }else{
        throw new CustomServerError('username already in use',400);
    }

   
  }

  async addGameIdToUser (username:string,gameId:string){
    return this.insert(`/${username}/gameID`,gameId,true);
  }
  async addProposedGoalIdToUser(username:string,goalId:string){
     return this.insert(`/${username}/proposed[]`,goalId,true)
  }

  async addGoalIdToUser(username:string,goalId:string){
    return this.insert(`/${username}/goals[]`,goalId,true)
  }

  async changeUserPassword(username:string,password:string){
    return this.insert(`/${username}/password`,password,true)
  }
  async removeTempPassword(username:string){
    return this.insert(`/${username}/tempPassword`,null)
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