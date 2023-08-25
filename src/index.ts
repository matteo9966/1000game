import './setEnv';
import {environment} from './config/environment';
import {initDB} from './db/DB';

import {configServer} from './server/config-server';
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
    console.log('environment:',JSON.stringify(environment,null,2))
    // console.log(`environment: ${JSON.stringify(environment,null,2)}`);
    // console.log(`__dirname: ${__dirname}`);
    // console.log(`__filename: ${__filename}`);
  });
}

main();
