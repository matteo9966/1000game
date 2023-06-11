import { Game } from "../Game.interface";
import { Response } from "./Response";

interface InsertUserBody  {
    name:string;
    password:string;
}

export type InsertUserResponse = Response<InsertUserBody>;