//signup the admin, the admin signs up with a username and a password,

import {RequestHandler} from 'express';
import {SignupAdminRequest} from '../../interfaces/Requests/SignupAdminRequest';
import {CustomServerError} from '../../errors/CustomServerError';
import {userModel} from '../../db/Models/User.model';
import {parseNewUser} from '../../utils/parseObject';
import {hashPassword} from '../../utils/hashPassword';
import {idGenerator} from '../../utils/idGenerator';
import {SignupAdminResponse} from '../../interfaces/Responses/signupAdminResponse';
import {logger2} from '../../logger/winston.logger';
import {basename} from 'path';
import {validateUsername} from '../../utils/validateUsername';

export const signupAdminController: RequestHandler = async (req, res, next) => {
  logger2('ERRORE!', basename(__filename));
  const body: SignupAdminRequest = req.body;
  if (!body.name || !body.password) {
    throw new CustomServerError('Please provide name and password', 400);
  }

  //TODO validate password

  const validUsername = validateUsername(
    body.name,
    /^[a-zA-Z0-9]*$/,
    'Only alphanumeric values are allowed'
  );

  if (validUsername?.username) {
    throw new CustomServerError(validUsername.username, 400);
  }

  const parsedUser = parseNewUser(body, idGenerator()); // create a new id for the user
  parsedUser.role = 'admin'; // set it to admin

  const passwordHash = await hashPassword(parsedUser.password);
  if (!passwordHash) {
    throw new CustomServerError(
      'Error while creating the new user - hash',
      500
    );
  }
  parsedUser.password = passwordHash;

  const inserted = await userModel.insertUser(parsedUser);
  if (!inserted) {
    throw new CustomServerError('Error while inserting the new user', 500);
  }

  const responseBody: SignupAdminResponse = {
    data: {
      success: true,
    },
    error: null,
  };

  res.json(responseBody);

  //the response is the user success:true
  //then i can login
};
