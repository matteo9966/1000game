import {basename} from 'path';
import {Game, GameLookupPlayers} from '../../interfaces/Game.interface';
import {Goal} from '../../interfaces/Goal.interface';
import {User} from '../../interfaces/User.interface';
import {logger2} from '../../logger/winston.logger';
import {DB, dbClient} from '../DB';
import {Model} from './Model';
import {userModel} from './User.model';
import {ProposedGoal} from '../../interfaces/ProposedGoal.interface';

class GameModel extends Model {
  constructor(db: DB, name: string) {
    super(db, name);
    this.appendGoals = this.appendGoals.bind(this);
    this.appendProposedGoals = this.appendProposedGoals.bind(this);
  }

  insertGame(game: Game) {
    return this.insert(`/${game.id}`, game);
  }

  appendGoals(goals: Goal[], gameId: string) {
    return this.insert(`/${gameId}/goals`, goals, false);
  }

  appendProposedGoals(goals: ProposedGoal[], gameId: string) {
    return this.insert(`/${gameId}/proposedGoals`, goals, false);
  }

  getGameById(gameId: string) {
    return this.get(`/${gameId}`) as Promise<Game>;
  }

  async getGameByIdLookupPlayers(gameId: string) {
    try {
      const game = await this.getGameById(gameId);
      const players = game.players;
      const playersList: Omit<User, 'password'>[] = [];
      for (let playerId of players) {
        const player = await userModel.findById<User>(playerId);

        if (player) {
          const playerWOpass: Omit<User, 'password'> & {password?: string} = {
            ...player,
          };
          delete playerWOpass.password;
          playersList.push(playerWOpass);
        }
      }
      const lookupGame: GameLookupPlayers = {...game, players: playersList};
      return lookupGame;
    } catch (error) {
      logger2(error, basename(__filename));
      return null;
    }
  }

  insertPlayer(gameId: string, playerId: string) {
    return this.insert(`/${gameId}/players[]`, playerId, false);
  }

  async upvoteProposedGoal(gameId: string, goalId: string, username: string) {
    try {
      const indexOfProposedGoal = await this.getIndex(
        `/${gameId}/proposedGoals`,
        goalId
      );

      if (indexOfProposedGoal < 0) {
        throw new Error('not found index -1');
      }

      const inserted = await this.insert(
        `/${gameId}/proposedGoals[${indexOfProposedGoal}]/votedBy[]`,
        username,
        true
      );

      return inserted;
    } catch (error) {
      logger2(error, __filename);
      return false;
    }
  }
}

export const gameModel = dbClient.createModel<GameModel>(GameModel, 'Games');

export type appendGoalType = typeof gameModel.appendProposedGoals;
