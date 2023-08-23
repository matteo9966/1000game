//signup the admin, the admin signs up with a username and a password,

import {RequestHandler, response} from 'express';
import { LoginRequest } from '../../interfaces/Requests/loginAdminRequest';
import { CustomServerError } from '../../errors/CustomServerError';
import { verifyPassword } from '../../utils/verifyPassword';
import { userModel } from '../../db/Models/modelInstances';
import { User } from '../../interfaces/User.interface';
import { gameModel } from '../../db/Models/modelInstances';
import { LoginResponse } from '../../interfaces/Responses/loginResponse';
import { logger2 } from '../../logger/winston.logger';
import { basename } from 'path';

export  const util = {verifyPassword}

export const loginController: RequestHandler = async (req, res, next) => {
   
const body:LoginRequest = req.body;
//1 verify password 2 verify role verify username
if(!body?.name || !body?.password){
    throw new CustomServerError('provide name and password',400);

}



const user =  await userModel.findByName(body.name);
if(!user){
    throw new CustomServerError('No user with provided ID',401)
}

const validPassword = await util.verifyPassword(user.password,body.password);

if(!validPassword){
    throw new CustomServerError('Invalid credentials',401);
}

const {password,...loggedInUser} = user;

const gameId = loggedInUser.gameID;  

let game=null;
if(gameId){
    try { 
        game = await gameModel.getGameByIdLookupPlayers(gameId) //user is not necessarily associated with a game
    } catch (error) {
        logger2(error,basename(__filename))
        game=null;
    }
}
const responseBody:LoginResponse = {
    error:null,
    data:{
        game:game,
        user:loggedInUser
    }
}


res.locals.payload = responseBody;
res.locals.authorizationPayload = {
    gameId:game?.id, //if the user loggs in and doesnt have the game i must provide a usertoken with the new game
    username:loggedInUser.name,
    role:loggedInUser.role,
}



next();

// res.json(responseBody)

};
