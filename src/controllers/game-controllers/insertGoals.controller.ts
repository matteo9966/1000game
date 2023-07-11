//add a list of goals to the existing goal to an existing

import {RequestHandler} from 'express';
import {Game} from '../../interfaces/Game.interface';
import {CustomServerError} from '../../errors/CustomServerError';
import {idGenerator} from '../../utils/idGenerator';
import {appendGoalType, gameModel} from '../../db/Models/Game.model';
import {InsertGoalResponse} from '../../interfaces/Responses/insertGoalsResponse';
import {InsertProposedGoalsRequest} from '../../interfaces/Requests/InsertProposedGoalsRequest';
import {parseNewGoal} from '../../utils/parseObject';
import { validateProposedGoal } from '../../utils/validateProposedGoal';

type asyncRequestHandler = (
  ...args: Parameters<RequestHandler>
) => Promise<ReturnType<RequestHandler>>;

export const insertProposedGoalsController: asyncRequestHandler = async (
  req,
  res,
  next
) => {
  const body: InsertProposedGoalsRequest = req.body;

  if (!body?.goals || !body?.gameId || !body?.username)
    throw new CustomServerError('missing goals or gameId or adminId', 400);

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
      'Invalid Body request, provide a list of goals of at least one goal',
      400
    );
  }



  const foundGame = await gameModel.findById<Game>(body.gameId);

  if (!foundGame) {
    throw new CustomServerError('Invalid Game,doesnt exist', 400);
  }

  const hasUser = foundGame.players.indexOf(body.username);

  if (hasUser < 0) {
    throw new CustomServerError(
      'you do not have the authorization to edit the game',
      401
    );
  }

  const dbGoals = body.goals
.filter(goal => !!goal?.name).filter(goal=>validateProposedGoal(goal,{nameRegex:/^[a-z0-9\ ]*$/i}))
    .map(goal => {
      const newGoal = parseNewGoal(goal, idGenerator());
      return newGoal;
    });

  const goalsForDB = dbGoals.map(goal => {
    const proposedBy = body.username;
    const votedBy: string[] = [];

    return {
      proposedBy,
      votedBy,
      goal,
    };
  });

  if (dbGoals.length > 0) {
    const inserted = await gameModel.appendProposedGoals(
      goalsForDB,
      body.gameId
    );
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

// export const insertProposedGoalsController = insertGoalsControllerFactory(
//   gameModel.appendProposedGoals
// );
