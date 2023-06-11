//signup the admin, the admin signs up with a username and a password,

import {RequestHandler} from 'express';
import { LoginAdminRequest } from '../../interfaces/Requests/loginAdminRequest';
import { CustomServerError } from '../../errors/CustomServerError';
import { verifyPassword } from '../../utils/verifyPassword';
import { userModel } from '../../db/Models/User.model';
import { User } from '../../interfaces/User.interface';


export const loginAdminController: RequestHandler = async (req, res, next) => {

const body:LoginAdminRequest = req.body;
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

//valid return the user

//TODO: RETURN THE USER WITHOUT THE PASSWORD
//TODO: ADD GAMEID TO USERS WHEN ADDING THE GAME AND WHEN ADMIN CREATES THE USERS

res.json();

  //the response is the user success:true
  //then i can login
};
