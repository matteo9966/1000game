import {RequestHandler} from 'express';
import {insertReachedGoalRequest} from '../../interfaces/Requests/InsertRechedGoalRequest';
import {CustomServerError} from '../../errors/CustomServerError';
import {logger2} from '../../logger/winston.logger';
import {gameModel} from '../../db/Models/modelInstances';
import {Game} from '../../interfaces/Game.interface';
import {userModel} from '../../db/Models/modelInstances';
import {InsertReachedGoalResponse} from '../../interfaces/Responses/InsertReachedGoalResponse';

/**
 * @description this controller can remove or add a goal depending on the request method, if the method is a delete it searches for the goal and 
 * removes it, if the method.
 * @param req 
 * @param res 
 * @param next 
 */
export const insertReachedGoalController: (
  ...args: Parameters<RequestHandler>
) => Promise<ReturnType<RequestHandler>> = async (req, res, next) => {
  const body: insertReachedGoalRequest = req.body;
  console.error(req.method);

  const method = req.method;
  if (!(body?.goalId && body?.name && body?.gameId)) {
    logger2(
      'missing goalId or userId or gameID in insertReachedGoalController',
      __filename
    );
    throw new CustomServerError('invalid body request', 400);
  }

  let game: Game | null = null;
  try {
    game = await gameModel.getGameById(body.gameId);
  } catch (error) {
    logger2(error, __filename);
    throw new CustomServerError('internal server error', 500);
  }

  if (!game) {
    throw new CustomServerError('no game with the provided id', 400);
  }
  const hasPlayer = game.players?.includes(body.name);
  if (!hasPlayer) {
    throw new CustomServerError(
      'No user with the provided id in the game',
      400
    );
  }
  const user = await userModel.findByName(body.name);
  if (!user) throw new CustomServerError('No user with the provided name', 400);

  const goal = game.goals.find(g => g?.id === body.goalId);

  if (!goal) {
    throw new CustomServerError('no goal with the provided id', 400);
  }

  console.log({methodname: req.method});

  if (method.toLowerCase() === 'delete') {
    // userModel
    // const goalIndex = await userModel.getGoalIndexById(body.name, body.goalId);
    // if (goalIndex < 0) {
    //   throw new CustomServerError('no goal found', 400);
    // }
    const deleted = await userModel.removeGoalFromUser(body.name, body.goalId);
    if (deleted) {
      const responseBody: InsertReachedGoalResponse = {
        data: {deleted: true},
        error: null,
      };
      res.json(responseBody);
    }
  } else {
    // const goalIndex = await userModel.getGoalIndexById(body.name, body.goalId);
    // if(goalIndex>=0){
    //   throw new CustomServerError('You already inserted this goal',400);
    // }
    const inserted = await userModel.addGoalIdToUser(body.name, body.goalId);
    if (!inserted) {
      throw new CustomServerError('error while saving the goal', 500);
    }
    const responseBody: InsertReachedGoalResponse = {
      data: {inserted: true},
      error: null,
    };
    res.json(responseBody);
  }
};
