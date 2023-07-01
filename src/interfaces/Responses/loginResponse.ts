import {  GameLookupPlayers } from "../Game.interface";
import { User } from "../User.interface";
import { Response } from "./Response";
export interface LoginResponseBody {
    game:GameLookupPlayers|null;
    user:Omit<User,'password'>;
}

export type LoginResponse = Response<LoginResponseBody>;