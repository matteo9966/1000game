import {Goal} from '../Goal.interface';


export interface InsertProposedGoalsRequest {
  goals: Goal[];
  gameId: string;
  username:string;
}
