import { Response } from "./Response";

interface InsertGameRequestBody {
    gameId:string;
}

export type InsertGameResponse = Response<InsertGameRequestBody>;