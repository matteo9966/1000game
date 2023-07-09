import { Goal } from "./Goal.interface";

export interface ProposedGoal {
    proposedBy: string;
    votedBy: string[];
    goal: Goal;
}