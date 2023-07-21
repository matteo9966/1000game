import * as sinon from 'sinon';
import {addAccessTokenMiddleware, utils} from './addAccessToken.middleware';
import * as express from 'express';
import * as supertest from 'supertest';
import { fail } from 'assert';
import { expect } from 'chai';
describe('addAccessTokenMiddleware', () => {
  function setup() {
    const createJWTStub = sinon.stub(utils, 'createJWT');
    const app = express();
    return {createJWTStub, app};
  }
  it('should add a token to the request header',async () => {
    const {createJWTStub, app} = setup();
    createJWTStub.resolves('token');
    app.get(
      '/test',
      (req:any, res:any, next:any) => {
        res.locals.authorizationPayload = {data: true};
        res.locals.payload = {payload: 'data'};
        next();
      },
      addAccessTokenMiddleware
    );


   const response = await supertest(app).get('/test')
   if(!response){
    fail()
   }

   const authorizationHeader = response.header['authorization']
   expect(authorizationHeader).to.contain('bearer');
   expect(authorizationHeader).to.contain('token');
   expect(response.status).to.equal(200);
   expect(response.body).to.deep.equal({payload: 'data'});
  });

});


