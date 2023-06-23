import "express-async-errors";
import * as e from 'express';
import { ROUTES } from '../config/routes.config';
import * as dotenv from 'dotenv';
import { errorMiddleware } from "../middleware/error.middleware";
import gameRoutes from '../routes/game.route';
import userRoutes from '../routes/user.route';
import * as cors from 'cors';
import { requestMonitorMiddleware } from "../middleware/request-monitor.middleware";
import route from './config-routes';
dotenv.config();
const basepath = process.env.BASEPATH 

export function configServer(){
    const app = e()
    app.use(e.json());
    app.use(requestMonitorMiddleware)
    app.use(cors({
        origin:['http://192.168.1.178:4200']
    }))
    app.use(`${basepath}${ROUTES.games.base}`,gameRoutes)
    app.use(`${basepath}${ROUTES.users.base}`,userRoutes)
    app.use(`${basepath}${ROUTES.health}`,route);
    app.use(errorMiddleware)
    return app

}