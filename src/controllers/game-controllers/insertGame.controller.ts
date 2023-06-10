import {RequestHandler} from 'express';
import { Game } from '../../interfaces/Game.interface';
import { InsertGameRequest } from '../../interfaces/Requests/InsertGameRequest';
import { CustomServerError } from '../../errors/CustomServerError';
import { idGenerator } from '../../utils/idGenerator';
import { gameModel } from '../../db/Models/Game.model';
import { InsertGameResponse } from '../../interfaces/Responses/InsertGameResponse';
export const insertGameController: RequestHandler = async (req, res, next) => {
    const body:InsertGameRequest = req.body;

    if(!body?.userId){
        throw new CustomServerError('Missing userId',400);
    }
    if(!body?.game){
        throw new CustomServerError('Missing game',400);
    }

    //same logic as the 

    const game:Game = {
        description:body.game?.description||"",
        goals:body.game?.goals || [],
        id:idGenerator(),
        players:[body.userId],
        proposedGoals:[],
        name:body.game?.name || `100 Points Game`
    }
    const inserted = await gameModel.insertGame(game)
    if(!inserted){
     throw new CustomServerError('Error while inserting game',500) 
    }

    const responseBody:InsertGameResponse = {
        data:{gameId:game.id},
        error:null
    }

    res.status(200)
    res.json(responseBody)

};
