import { Goal } from "./Goal.interface";

export interface Game{
    name:string;
    description:string;
    players:string[]; //PlayersIds
    goals:Goal[]
    proposedGoals:Goal[]
    id:string;
}
