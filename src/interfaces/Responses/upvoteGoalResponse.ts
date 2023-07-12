import { Game } from "../Game.interface";
import { Response } from "./Response";

interface UpvoteGoalResponseBody {
    success:boolean;
}

export type UpvoteGoalResponse = Response<UpvoteGoalResponseBody>;