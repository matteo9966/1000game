import { Game } from "../Game.interface";
import { User } from "../User.interface";
import { Response } from "./Response";
import { LoginResponseBody } from "./loginResponse";

interface InsertGameResponseBody {
   game:Game,
   user:Omit<User,'password'>
}

export type InsertGameResponse = Response<LoginResponseBody>