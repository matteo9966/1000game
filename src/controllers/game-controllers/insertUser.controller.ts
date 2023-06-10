// admin user can add user to a game, it makes two updates: insert user in userdb insert user in db

import {RequestHandler} from 'express';
import {gameModel} from '../../db/Models/Game.model';
import {userModel} from '../../db/Models/User.model';
import {CustomServerError} from '../../errors/CustomServerError';
import {InsertUserRequest} from '../../interfaces/Requests/InsertUserRequest';
import {User} from '../../interfaces/User.interface';
import {hashPassword} from '../../utils/hashPassword';
import {idGenerator} from '../../utils/idGenerator';
import {parseNewUser} from '../../utils/parseObject';

export const insertUserController: RequestHandler = async (req, res, next) => {
  //get adminID get user id
  const body: InsertUserRequest = req.body;
  if (!body?.adminId || !body?.gameId || !body?.username) {
    throw new CustomServerError(
      'Please provide adminId,gameId and username',
      400
    );
  }

  const user = await userModel.findById<User>(body.adminId);
  if (!user) {
    throw new CustomServerError('User with provided id does not exist', 400);
  }

  const game = await gameModel.getGameById(body.gameId);
  if (!game) {
    throw new CustomServerError('Game with provided id does not exist', 400);
  }
  const isPartOfGame = game.players.includes(body.adminId); //is part of group
  if (!isPartOfGame || !(user.role === 'admin')) {
    throw new CustomServerError(
      'You do not have the authorization to edit this game',
      401
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

  const inserted = await userModel.insertUser(parsedUser);
  if (!inserted) {
    throw new CustomServerError('error while inserting the new user', 500);
  }

  //insert user in the game  gameModel: append userId to game
  const insertedPlayer = await gameModel.insertPlayer(
    body.gameId,
    parsedUser.id
  );
  if (!insertedPlayer) {
    throw new CustomServerError(
      'error while inserting the new user, retry later',
      500
    );
  }

  //i inserted the user , now just return the user with its temporary passowrd

  /* 
    {
        name:'matteo',
        tempPassword:'my new password'
    }
  
  */
};
