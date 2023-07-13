import { GameLookupPlayers } from '../Game.interface';
import {Response} from './Response';

export interface RefreshResponseBody {
  game:GameLookupPlayers;
}

export type RefreshResponse = Response<RefreshResponseBody>;
