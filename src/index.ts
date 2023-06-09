import { initDB } from './db/DB';
import { testModel } from './db/Models/Test.model';
import { configServer } from './server/config-server';
import * as dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 6000;
function main(){
   const initialized = initDB();
  const app = configServer();
  if(!app){
    process.exit(1);
  }
  const server = app.listen(port,()=>{console.log(`Listening on port ${(<any>server?.address())?.port}`)})
}

main()