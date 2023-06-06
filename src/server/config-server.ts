import * as e from 'express';
import router from './config-routes';
import { ROUTES } from '../config/routes.config';
import * as dotenv from 'dotenv';
dotenv.config();
const basepath = process.env.BASEPATH 

export function configServer(){
    const app = e()
    console.log("basepath:",basepath);
    if (!basepath) return null
    app.use(basepath,router)
    // app.listen(port)
    return app
}