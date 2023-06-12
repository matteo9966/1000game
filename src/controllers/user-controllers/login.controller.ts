//signup the admin, the admin signs up with a username and a password,

import {RequestHandler, response} from 'express';
import { LoginRequest } from '../../interfaces/Requests/loginAdminRequest';
import { CustomServerError } from '../../errors/CustomServerError';
import { verifyPassword } from '../../utils/verifyPassword';
import { userModel } from '../../db/Models/User.model';
import { User } from '../../interfaces/User.interface';
import { gameModel } from '../../db/Models/Game.model';
import { LoginResponse } from '../../interfaces/Responses/loginResponse';
import { logger2 } from '../../logger/winston.logger';
import { basename } from 'path';


export const loginController: RequestHandler = async (req, res, next) => {

const body:LoginRequest = req.body;
//1 verify password 2 verify role verify username
if(!body?.name || !body?.password){
    throw new CustomServerError('provide name and password',400);

}


const user =  await userModel.findByName<User>(body.name);
if(!user){
    throw new CustomServerError('No user with provided ID',401)
}

const validPassword = await verifyPassword(user.password,body.password);

if(!validPassword){
    throw new CustomServerError('Invalid credentials',401);
}

const {password,...loggedInUser} = user;

const gameId = loggedInUser.gameID;  

let game;
try { 
    game = await gameModel.getGameById(gameId) //user is not necessarily associated with a game
} catch (error) {
    logger2(error,basename(__filename))
    game=null;
}

const responseBody:LoginResponse = {
    error:null,
    data:{
        game:game,
        user:loggedInUser
    }
}

res.json(responseBody)

};
