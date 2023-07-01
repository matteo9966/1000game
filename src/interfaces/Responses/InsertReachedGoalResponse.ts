import {Response} from './Response';

export interface InsertReachedGoalResponseBody {
  inserted: boolean;
}

export type InsertReachedGoalResponse = Response<InsertReachedGoalResponseBody>;
