import {RequestHandler} from 'express';
import {Game, GameLookupPlayers} from '../../interfaces/Game.interface';
import {InsertGameRequest} from '../../interfaces/Requests/InsertGameRequest';
import {CustomServerError} from '../../errors/CustomServerError';
import {idGenerator} from '../../utils/idGenerator';
import {gameModel} from '../../db/Models/Game.model';
import {InsertGameResponse} from '../../interfaces/Responses/InsertGameResponse';
import {userModel} from '../../db/Models/User.model';
import {User} from '../../interfaces/User.interface';
import {readFile} from 'fs/promises';
import {join} from 'path';
import {Goal} from '../../interfaces/Goal.interface';
import { logger2 } from '../../logger/winston.logger';
import { gamedata } from './gamedata';
export const insertGameController: RequestHandler = async (req, res, next) => {
  const body: InsertGameRequest = req.body;

  if (!body?.username) {
    throw new CustomServerError('Missing userId', 400);
  }
  if (!body?.game) {
    throw new CustomServerError('Missing game', 400);
  }

  //same logic as the
  const user = await userModel.findByName<User>(body.username);
  if (!user) {
    throw new CustomServerError('Invalid username', 400);
  }

  //one game per user, so admin can create only one game, if he wants to create multiple games i must have multiple accounts
  if (user.gameID) {
    throw new CustomServerError('Admin already created a game', 400);
  }

  let goals:Goal[]=[];


  const game: Game = {
    description: body.game?.description || '',
    goals:gamedata,
    id: idGenerator(),
    players: [body.username],
    proposedGoals: [],
    name: body.game?.name || `100 Points Game`,
  };

  const inserted = await gameModel.insertGame(game);
  if (!inserted) {
    throw new CustomServerError('Error while inserting game', 500);
  }

  //add game id to user

  const updatedUser = await userModel.addGameIdToUser(body.username, game.id);

  const {players, ...gameWOPlayers} = game;
  const gameWithEmptyPlayers: GameLookupPlayers = {
    ...gameWOPlayers,
    players: [{
      gameID:game.id,
      goals:user.goals,
      id:user.id,
      name:user.name,
      proposed:user.proposed,
      role:user.role,
    }],
  };

  if (!updatedUser) {
    throw new CustomServerError('Error while updating user with new game', 500);
  }

  const {password, ...userWOPasswrod} = user;
  const responseBody: InsertGameResponse = {
    data: {game: gameWithEmptyPlayers, user: userWOPasswrod},
    error: null,
  };

  res.status(200);
  res.json(responseBody);
};


