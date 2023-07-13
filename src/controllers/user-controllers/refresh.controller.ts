//signup the admin, the admin signs up with a username and a password,

import {RequestHandler} from 'express';
import {CustomServerError} from '../../errors/CustomServerError';
import {gameModel} from '../../db/Models/Game.model';
import {RefreshResponse} from '../../interfaces/Responses/refreshResponse';

export const refreshGameController: RequestHandler = async (req, res, next) => {
  const {id: gameId} = req.params;
  if (!gameId) {
    throw new CustomServerError('Missing game id', 400);
  }
  const game = await gameModel.getGameByIdLookupPlayers(gameId); //user is not necessarily associated with a game
  if (!game) {
    throw new CustomServerError('No game found with the provided Id', 400);
  }
  const response: RefreshResponse = {
    data: {game},
    error: null,
  };
  res.json(response);
};
