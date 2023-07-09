import {Goal} from './Goal.interface';
import { ProposedGoal } from './ProposedGoal.interface';
import {User} from './User.interface';

export interface Game {
  name: string;
  description: string;
  players: string[]; //PlayersIds
  goals: Goal[];
  proposedGoals: ProposedGoal[];
  id: string;
}

export type GameLookupPlayers = Omit<Game, 'players'> & {players: Omit<User,'password'>[]};
