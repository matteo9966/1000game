import {Game} from '../../interfaces/Game.interface';
import {Goal} from '../../interfaces/Goal.interface';
import {DB, dbClient} from '../DB';
import {Model} from './Model';

class GameModel extends Model {
  constructor(db: DB, name: string) {
    super(db, name);
  }

  insertGame(game: Game) {
    return this.insert(`/${game.id}`, game);
  }

  appendGoals(goals: Goal[], gameId: string) {
    return this.insert(`/${gameId}/goals`, goals, false);
  }

  getGameById(gameId:string){
    return this.get(`/${gameId}`) as Promise<Game>;
  }
}

export const gameModel = dbClient.createModel<GameModel>(GameModel, 'Games');
