import {config} from 'dotenv';
import { B64ToASCII } from '../utils/base64-to-ascii';

config();

//all the environment variables here!

const  privateKey = B64ToASCII(process.env.PRIVATEKEY);
const publicKey = B64ToASCII(process.env.PUBLICKEY);


export const environment = {
 basepath:process.env.BASEPATH,
 port:process.env.PORT,
 env:process.env.ENV,
 dbname:process.env.DBNAME,
 privatekey:privateKey,
 publickey:publicKey,
}