import { Game } from "../Game.interface";

export interface InsertGameRequest{
    userId:string;
    game:Game;
}