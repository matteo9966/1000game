import {gameModel} from '../db/Models/Game.model';
import {userModel} from '../db/Models/User.model';
import {CustomServerError} from '../errors/CustomServerError';
import {User} from '../interfaces/User.interface';
import { logger2 } from '../logger/winston.logger';
import { basename } from 'path';


export async function checkAdminPermission(adminId:string,gameId:string){
  

    try {
      const user = await userModel.findById<User>(adminId);
      if (!user) {
        throw new CustomServerError('User with provided id does not exist', 400);
      }
      const game = await gameModel.getGameByIdLookupPlayers(gameId);
      if (!game) {
        throw new CustomServerError(
          'Error while fetching the game data from database',
          500
        );
      }
      const isPartOfGame = game.players.map(p => p.id).includes(adminId); //is part of group
      if (!isPartOfGame || !(user.role === 'admin')) {
        throw new CustomServerError(
          'You do not have the authorization to edit this game',
          401
        );
      }
    
      return {authorized:true,game,user};
  
      
    } catch (error) {
      logger2(error,basename(__filename))
      return {authorized:false,game:null,user:null}
    }
  
  
  }