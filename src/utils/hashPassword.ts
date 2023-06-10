import * as argon2 from 'argon2';
import {logger2} from '../logger/winston.logger';
import path = require('path');
export const hashPassword = async function (password: string) {
  try {
    const hash = await argon2.hash(password);
    return hash;
  } catch (error) {
    logger2(error, path.basename(__filename));
    return null;
  }
};

console.log(__filename);
