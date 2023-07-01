import {Goal} from './Goal.interface';
import {User} from './User.interface';

export interface Game {
  name: string;
  description: string;
  players: string[]; //PlayersIds
  goals: Goal[];
  proposedGoals: Goal[];
  id: string;
}

export type GameLookupPlayers = Omit<Game, 'players'> & {players: Omit<User,'password'>[]};
