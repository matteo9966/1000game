import {Goal} from '../Goal.interface';

export interface InsertGoalsRequest {
  goals: Goal[];
  gameId: string;
}
