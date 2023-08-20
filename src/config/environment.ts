import { DotenvParseOutput } from 'dotenv';
import {B64ToASCII} from '../utils/base64-to-ascii';
export const environment = {
  basepath: '',
  port: '',
  env: '',
  dbname: '',
  privatekey: '',
  publickey: '',
};

export function initEnvironment(parsed: DotenvParseOutput) {
  environment.basepath = parsed.BASEPATH;
  environment.dbname = parsed.DBNAME;
  environment.env = parsed.ENV;
  environment.port = parsed.PORT;
  environment.privatekey = B64ToASCII(parsed.PRIVATEKEY)!;
  environment.publickey = B64ToASCII(parsed.PRIVATEKEY)!;
}

