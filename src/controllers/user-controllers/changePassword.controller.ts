//user must insert a password this is a change password controller

import {RequestHandler} from 'express';
import {changePasswordRequest} from '../../interfaces/Requests/changePasswordRequest';
import {CustomServerError} from '../../errors/CustomServerError';
import {hashPassword} from '../../utils/hashPassword';
import {userModel} from '../../db/Models/modelInstances';
import {ChangePasswordResponse} from '../../interfaces/Responses/changePasswordResponse';
import { User } from '../../interfaces/User.interface';

export const changePasswordController: RequestHandler = async (
  req,
  res,
  next
) => {
  const body: changePasswordRequest = req.body;
  //if user looses password, admin regenerates new password
  if (!body?.newPassword || !body?.username)
    throw new CustomServerError(
      'please provide a valid newPassword and a valid username',
      400
    );

  //hash the password
  const user = await userModel.findByName(body.username);
  if(!user) throw new CustomServerError('Invalid user',400);
  const temppassword = user.tempPassword;
  if(temppassword){
   const removed =  await userModel.removeTempPassword(body.username);
   if(!removed) throw new CustomServerError('Error while updating the password retry later',500);
  }
  
  const hashed = await hashPassword(body.newPassword);
  if (!hashed) {
    throw new CustomServerError('error while updating the password', 500);
  }

  const result = await userModel.changeUserPassword(
    body.username,
    hashed
  );
  if (!result) {
    throw new CustomServerError('Error while updating password', 500);
  }

  const response: ChangePasswordResponse = {
    data: {
      changed: true,
    },
    error: null,
  };

  res.json(response);
};
