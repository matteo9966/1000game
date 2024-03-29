import {RequestHandler} from 'express';
import {Game, GameLookupPlayers} from '../../interfaces/Game.interface';
import {InsertGameRequest} from '../../interfaces/Requests/InsertGameRequest';
import {CustomServerError} from '../../errors/CustomServerError';
import {idGenerator} from '../../utils/idGenerator';
import {gameModel} from '../../db/Models/modelInstances';
import {InsertGameResponse} from '../../interfaces/Responses/InsertGameResponse';
import {userModel} from '../../db/Models/modelInstances';
// import {User} from '../../interfaces/User.interface';
import {Goal} from '../../interfaces/Goal.interface';
import {gamedata} from './gamedata';

/**
 * 
 * @param req express request
 * @param res express response
 * @param next next function
 * @description this is the controller that is called when the admin add a game,
 * you need to provide a valid username and a valid game to create the game.
 * if the game already exists, it will throw an error.
 * When creating a new game a new session token is returned with an updated payload - the game id
 *
 * The game will be created with the following structure:
 *
 * `
 * {
 *  id:string
 *  name:string
 *  description:string
 *  players:string[]
 *  proposedGoals:string[]
 *  goals:Goal[]
 * }
 * `
 *
 * if  the user does not exist it will throw an error.
 * if the user already has a game, it will throw an error.
 * ################################################################
 * # You need authorization to access this route! (role='admin'); #
 * ################################################################
 */
export const insertGameController: (...args:Parameters<RequestHandler>)=>Promise<void> = async (req, res, next) => {
  

  const body: InsertGameRequest = req.body;
  
  if (!body?.username) {
    throw new CustomServerError('Missing userId', 400);
  }
  if (!body?.game) {
    throw new CustomServerError('Missing game', 400);
  }

  //same logic as the
  const user = await userModel.findByName(body.username);
  if (!user) {
    throw new CustomServerError('Invalid username', 400);
  }
  
  //one game per user, so admin can create only one game, if he wants to create multiple games i must have multiple accounts
  if (user.gameID) {
    throw new CustomServerError('Admin already created a game', 400);
  }

  let goals: Goal[] = [];

  const game: Game = {
    description: body.game?.description || '',
    goals: gamedata,
    id: idGenerator(),
    players: [body.username],
    proposedGoals: [],
    name: body.game?.name || `1000 Points Game`,
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
    players: [
      {
        gameID: game.id,
        goals: user.goals,
        id: user.id,
        name: user.name,
        proposed: user.proposed,
        role: user.role,
      },
    ],
  };
 
  if (!updatedUser) {
    throw new CustomServerError('Error while updating user with new game', 500);
  }

  

  const {password, ...userWOPasswrod} = user;
  userWOPasswrod.gameID=game.id
  const responseBody: InsertGameResponse = {
    data: {game: gameWithEmptyPlayers, user: userWOPasswrod},
    error: null,
  };

  res.locals.payload = responseBody;
  res.locals.authorizationPayload = {
    gameId: game?.id, //if the user loggs in and doesnt have the game i must provide a usertoken with the new game
    username: user.name,
    role: user.role,
  };

  next();
};
