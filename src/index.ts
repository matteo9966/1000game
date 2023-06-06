import * as dotenv from 'dotenv';
import { configServer } from './server/config-server';
dotenv.config();
const port = process.env.PORT || 6000;
function main(){
  const app = configServer();
  const server = app.listen(port,()=>{console.log(`Listening on port ${(<any>server?.address())?.port}`)})
}

main()