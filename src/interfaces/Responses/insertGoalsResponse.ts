import { Game } from "../Game.interface";
import { Response } from "./Response";

interface InsertGoalResponseBody {
    game:Game
}

export type InsertGoalResponse = Response<InsertGoalResponseBody>;