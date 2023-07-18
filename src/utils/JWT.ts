import * as jwt from 'jsonwebtoken';
import * as path from 'path';
import * as fs from 'fs';

const privateKeyUrl = path.join(__dirname, '../../private.pem');
const publicKeyUrl = path.join(__dirname, '../../public.pem');
export const fsUtils = {
  readFileSync: fs.readFileSync,
};
const publicKey = fsUtils.readFileSync(publicKeyUrl, {encoding: 'utf8'});
const privateKey = fsUtils.readFileSync(privateKeyUrl, {encoding: 'utf8'});

export const keys = {
  publicKey,
  privateKey,
};

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
        keys.privateKey,
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
    jwt.verify(token, keys.publicKey, (err, payload) => {
  
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
