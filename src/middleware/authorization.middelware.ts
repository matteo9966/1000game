import {RequestHandler} from 'express';
import {CustomServerError} from '../errors/CustomServerError';
import {verifyJWT} from '../utils/JWT';
import {SessionTokenPayload} from '../interfaces/sessionTokenPayload.interface';
type role = 'admin' | 'user';
type promisifiedHandler = (
  ...args: Parameters<RequestHandler>
) => Promise<void>;

export const utils = {verifyJWT};
export function authorizationMiddleware(
  roles: role[]
): (...args: Parameters<RequestHandler>) => Promise<void> {
  const authHandler: promisifiedHandler = async (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth) {
      throw new CustomServerError('You are not authorized', 401);
    }
    const token = auth.split(' ')[1];
    const payload = await utils.verifyJWT<SessionTokenPayload>(token);
    if (!payload) {
      throw new CustomServerError('You are not authorized', 401);
    }
    if (!roles.includes(payload.role)) {
      throw new CustomServerError('You are not authorized', 401);
    }

    next();
  };
  return authHandler;
}
