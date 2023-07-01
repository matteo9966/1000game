import { Game } from "../Game.interface";

export interface InsertGameRequest{
    username:string;
    game:Pick<Game,'name'|'description'>;
}