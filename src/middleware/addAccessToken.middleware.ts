import {RequestHandler} from 'express';
import {CustomServerError} from '../errors/CustomServerError';
import {logger2} from '../logger/winston.logger';
import {createJWT} from '../utils/JWT';

import {Express} from 'express';


export const utils = {createJWT}

type Promisified<T extends (...args: any) => any> = (
  ...args: Parameters<T>
) => Promise<void>;

/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.NextFunction} next
 * @returns {Promise<void>}
 * @description this middleware adds the access token to the response header
 * it also reads from the locals the authorizationPayload and the payload
 * the authorization payload is the value that is used to create the jwt token
 * the payload property is the object that is sent to the client in the response using res.json
 * if you don't pass anything a plain res.end() is called
 */
export const addAccessTokenMiddleware: Promisified<RequestHandler> = async (
  req,
  res,
  next
) => {
  
  const authorizationPayload = res.locals?.authorizationPayload;
  const payload = res.locals?.payload;
  if (!authorizationPayload) {
    logger2('authorization payload not found', __filename);
    throw new CustomServerError('authorzation error', 401);
  }
  const token = await utils.createJWT(authorizationPayload);
  if (!token) {
    logger2('authorization error, the token was not created', __filename);
    throw new CustomServerError('error while creating the access token!', 500);
  }
  res.setHeader("Access-Control-Expose-Headers", "Authorization")
  res.setHeader('Authorization', `bearer ${token}`);
  if (payload) {
    res.json(payload);
  } else {
    res.end();
  }
};
