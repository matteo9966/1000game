//add a list of goals to the existing goal to an existing

import {RequestHandler} from 'express';
import {Game} from '../../interfaces/Game.interface';
import {CustomServerError} from '../../errors/CustomServerError';
import {idGenerator} from '../../utils/idGenerator';
import {gameModel} from '../../db/Models/Game.model';
import { InsertGoalResponse } from '../../interfaces/Responses/insertGoalsResponse';
import {InsertGoalsRequest} from '../../interfaces/Requests/InsertGoalsRequest';
export const insertGoalsController: RequestHandler = async (req, res, next) => {
  const body: InsertGoalsRequest = req.body;

  if (!body?.goals || !body?.gameId)
    throw new CustomServerError('missing goals or gameId', 400);

  if (body?.goals && body.goals?.length === 0) {
    res.status(200);
    res.end();
    return;
  }

  //check that goals is of type array
  //add id to each goal
  //try and do an Object.assign(templateObj,goal);
  
  const dbGoals = body.goals.map(goal=>({...goal,id:idGenerator(),}))

  const inserted = await gameModel.appendGoals(body.goals, body.gameId);

  if (!inserted) {
    throw new CustomServerError('Error while adding goal', 500);
  }

  const game = await gameModel.getGameById(body.gameId);
  
  if(!game){
    throw new CustomServerError('Error while updating the game',500);
  }


  const responseBody:InsertGoalResponse = {
    error:null,
    data:{game}
  }
  res.json(responseBody)
  res.status(200);
};
