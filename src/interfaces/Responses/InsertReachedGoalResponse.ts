import {Response} from './Response';

export interface InsertReachedGoalResponseBody{
  inserted?: boolean;
  deleted?:boolean;
}

export type InsertReachedGoalResponse = Response<InsertReachedGoalResponseBody>;
