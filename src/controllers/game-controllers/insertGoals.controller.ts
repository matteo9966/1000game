//add a list of goals to the existing goal to an existing

import {RequestHandler} from 'express';
import {Game} from '../../interfaces/Game.interface';
import {CustomServerError} from '../../errors/CustomServerError';
import {idGenerator} from '../../utils/idGenerator';
import {appendGoalType, gameModel} from '../../db/Models/Game.model';
import {InsertGoalResponse} from '../../interfaces/Responses/insertGoalsResponse';
import {InsertGoalsRequest} from '../../interfaces/Requests/InsertGoalsRequest';
import {parseNewGoal} from '../../utils/parseObject';

export const insertGoalsControllerFactory:(appendFn:appendGoalType)=> RequestHandler = (appendFn)=> async (req, res, next) => {
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

  if (!Array.isArray(body.goals)) {
    throw new CustomServerError(
      'Invalid Body request, provide a list of goals of at least one element',
      400
    );
  }

  const foundGame = await gameModel.findById(body.gameId);

  if (!foundGame) {
    throw new CustomServerError('Invalid Game,doesnt exist', 400);
  }

  const dbGoals = body.goals
    .filter(goal => (!!goal?.name && goal?.points>0))
    .map(goal => {
      const newGoal = parseNewGoal(goal, idGenerator());
      return newGoal;
    });

  if (dbGoals.length > 0) {
    const inserted = await appendFn(dbGoals, body.gameId);

    if (!inserted) {
      throw new CustomServerError('Error while adding goal', 500);
    }
  }

  const game = await gameModel.getGameById(body.gameId);

  if (!game) {
    throw new CustomServerError('Error while updating the game', 500);
  }

  const responseBody: InsertGoalResponse = {
    error: null,
    data: {game},
  };

  res.json(responseBody);
  res.status(200);
};

export const insertGoalsController = insertGoalsControllerFactory(gameModel.appendGoals)
export const insertProposedGoalsController = insertGoalsControllerFactory(gameModel.appendProposedGoals)