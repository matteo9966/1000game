import {Goal} from '../Goal.interface';

type MakeRequired<T, Key extends keyof T> = T & {
  [Property in Key]-?: T[Property];
};
export type RequiredOnlyNameAndPointsGoalType = MakeRequired<
  Partial<Goal>,
   'name' 
>;

export interface InsertProposedGoalsRequest {
  goals: RequiredOnlyNameAndPointsGoalType[];
  gameId: string;
  username: string;
}
