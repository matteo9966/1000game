import {environment} from './config/environment';
import {initDB} from './db/DB';
import {testModel} from './db/Models/Test.model';
import {configServer} from './server/config-server';
import * as dotenv from 'dotenv';

let pth = '';
switch (process.env.NODE_ENV) {
  case 'dev':
    pth = './development.env';
    break;
  case 'test':
    pth = './test.env';
    break;
  case 'prod':
    pth = './.env';
    break;

  default:
    break;
}

dotenv.config({path: pth});
console.log('NodeEnvironment:', process.env.NODE_ENV);
const port = process.env.PORT || 6000;
function main() {
  const initialized = initDB();
  const app = configServer();
  if (!app) {
    process.exit(1);
  }

  /**
   * @constant {Express.Application} server this is the server object listening to the requests,
   * when it starts it will print the port number where the server is listening to the requests.
   */
  const server = app.listen(port, () => {
    console.log(`Listening on port ${(<any>server?.address())?.port}`);
    console.log(`Basepath: ${environment.basepath}`);
    console.log(`DBName: ${environment.dbname}`);
    console.log(`env: ${environment.env}`);
    console.log(`__dirname: ${__dirname}`);
    console.log(`__filename: ${__filename}`);
  });
}

main();
