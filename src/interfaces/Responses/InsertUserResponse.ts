import { Game, GameLookupPlayers } from "../Game.interface";
import { Response } from "./Response";

interface InsertUserBody  {
    user:{
        name:string;
        password:string;
    },
    game:GameLookupPlayers
}

export type InsertUserResponse = Response<InsertUserBody>;