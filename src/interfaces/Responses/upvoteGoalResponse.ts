import { Game } from "../Game.interface";
import { Goal } from "../Goal.interface";
import { ProposedGoal } from "../ProposedGoal.interface";
import { Response } from "./Response";

interface UpvoteGoalResponseBody {
    proposedGoals:ProposedGoal[],
    goals:Goal[],
}

export type UpvoteGoalResponse = Response<UpvoteGoalResponseBody>;