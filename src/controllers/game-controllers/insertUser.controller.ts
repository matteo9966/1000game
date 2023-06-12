// admin user can add user to a game, it makes two updates: insert user in userdb insert user in db

import {RequestHandler, response} from 'express';
import {gameModel} from '../../db/Models/Game.model';
import {userModel} from '../../db/Models/User.model';
import {CustomServerError} from '../../errors/CustomServerError';
import {InsertUserRequest} from '../../interfaces/Requests/InsertUserRequest';
import {User} from '../../interfaces/User.interface';
import {hashPassword} from '../../utils/hashPassword';
import {idGenerator} from '../../utils/idGenerator';
import {parseNewUser} from '../../utils/parseObject';
import {InsertUserResponse} from '../../interfaces/Responses/InsertUserResponse';
import { logger2 } from '../../logger/winston.logger';
import { basename } from 'path';

export const insertUserController: RequestHandler = async (req, res, next) => {
  //get adminID get user id
  const body: InsertUserRequest = req.body;
  if (!body?.adminId || !body?.gameId || !body?.username) {
    throw new CustomServerError(
      'Please provide adminId,gameId and username',
      400
    );
  }

  //check if the game already has the same username

  const user = await userModel.findByName<User>(body.adminId);
  if (!user) {
    throw new CustomServerError('User with provided id does not exist', 400);
  }

  const game = await gameModel.getGameByIdLookupPlayers(body.gameId);
  if (!game) {
    throw new CustomServerError(
      'Error while fetching the game data from database',
      500
    );
  }
  const isPartOfGame = game.players.map(p => p.name).includes(body.adminId); //is part of group
  if (!isPartOfGame || !(user.role === 'admin')) {
    throw new CustomServerError(
      'You do not have the authorization to edit this game',
      401
    );
  }

  if (game.players.map(p => p.name).includes(body.username)) {
    throw new CustomServerError(
      'User with provided name is already in the game, choose another username',
      400
    );
  }

  //is admin and is part of the  game!

  //create  the user
  const temporaryUserPassword = idGenerator();

  const newUser: Partial<User> = {
    name: body.username,
    password: temporaryUserPassword,
  };
  const parsedUser = parseNewUser(newUser, idGenerator());
  const hashedPassword = await hashPassword(temporaryUserPassword);
  if (!hashedPassword) {
    throw new CustomServerError('Error while creating the user', 500);
  }
  parsedUser.password = hashedPassword;
  parsedUser.gameID = body.gameId;
  parsedUser.tempPassword = temporaryUserPassword; 

  const inserted = await userModel.insertUser(parsedUser);
  if (!inserted) {
    throw new CustomServerError('error while inserting the new user', 500);
  }

  //insert user in the game  gameModel: append userId to game
  const insertedPlayer = await gameModel.insertPlayer(
    body.gameId,
    parsedUser.name
  );
  if (!insertedPlayer) {
    throw new CustomServerError(
      'error while inserting the new user, retry later',
      500
    );
  }

  const responseBody: InsertUserResponse = {
    error: null,
    data: {
      name: parsedUser.name,
      password: temporaryUserPassword,
    },
  };

  res.json(responseBody);

};
