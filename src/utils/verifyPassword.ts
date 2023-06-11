import * as argon2 from 'argon2';
import {logger2} from '../logger/winston.logger';
import {basename} from 'path';
export const verifyPassword = async function (hash: string, password: string) {
  try {
    if (await argon2.verify(hash, password)) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    logger2(err, basename(__filename));
    return false;
  }
};
