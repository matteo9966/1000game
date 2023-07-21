import * as jwt from 'jsonwebtoken';
import { environment } from '../config/environment';


const publicKey =environment.publickey!
const privateKey = environment.privatekey!;



export const createJWT: (
  payload: any,
  expiresIn?: number
) => Promise<null | string> = function (
  payload: any,
  expiresIn = 60 * 60 * 24
) {
  return new Promise((res, rej) => {
    try {
      jwt.sign(
        payload,
        environment.privatekey!,
        {algorithm: 'RS256', expiresIn},
        (err, token) => {
          if (err) {
            res(null);
          }
          if (token) {
            res(token);
          } else {
            res(null);
          }
        }
      );
    } catch (error) {
      res(null);
    }
  });
};

export const verifyJWT: <T>(token: string) => Promise<null | T> = <T = any>(
  token: string
) => {
  return new Promise<T | null>((res, rej) => {
    jwt.verify(token, environment.publickey!, (err, payload) => {
  
      if (err) {
        res(null);
      } else {
        if (!payload) {
          res(null);
          return;
        }
        const resp: T = payload as any;
        res(resp);
      }
    });
  });
};
