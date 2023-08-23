/**
 * @file this is the integration test for the login route
 */
import * as express from 'express';
import * as request from 'supertest';
import {loginController,util} from '../../controllers/user-controllers/login.controller';
import {addAccessTokenMiddleware,utils} from '../../middleware/addAccessToken.middleware';
import { userModel } from '../../db/Models/modelInstances';
import { gameModel } from '../../db/Models/modelInstances';
import * as sinon from 'sinon';
import { fail } from 'assert';
import {expect} from 'chai';

describe('login route', () => {
    let findByNameStub:any;
    let verifyPasswordStub:any;
    let getGameByIdLookupPlayersStub:any;
    let createJWTStub:any;
    const app = express();
  app.use(express.json());
  app.post('/login', loginController,addAccessTokenMiddleware);
  
  beforeEach(()=>{
    sinon.reset();
    sinon.restore();
   findByNameStub  = sinon.stub(userModel, 'findByName');
   verifyPasswordStub = sinon.stub(util, 'verifyPassword');
   getGameByIdLookupPlayersStub = sinon.stub(gameModel, 'getGameByIdLookupPlayers');
   createJWTStub = sinon.stub(utils, 'createJWT');
   console.log('hello!!!')
  })

  it('should return 200 and a token', async () => {
      findByNameStub.resolves({password:'password',name:'username-name',role:'admin',gameId:'gameid'})
      verifyPasswordStub.resolves(true)
      getGameByIdLookupPlayersStub.resolves({id:'gameId'})
      createJWTStub.resolves('token')
       
      const response = await request(app).post('/login').send({
        name:'name',
        password:'XXXXXXXX',
      })

      if(!response){
        fail();
      }

      expect(response.status).to.eq(200);
      expect(response.get('authorization')).to.exist
      expect(response.get('authorization')).to.contain('bearer');
  
  });
  
});
