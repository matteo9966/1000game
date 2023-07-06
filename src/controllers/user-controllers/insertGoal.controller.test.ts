//TODO:
import {Request, Response} from 'express';
import {insertReachedGoalController} from './insertGoal.controller';
import * as chai from 'chai';
import { CustomServerError } from '../../errors/CustomServerError';
const expect = chai.expect;
describe('insertReachedGoalController Test', function () {
  console.log('env:',process.env.ENV,)
  console.log('dotenv-env:',process.env.NODE_ENV)
  it('should throw a customServer error if missing goalId name or gameId in body', async function () {
    
    // console.log("ENVIRONMENT in test:",process.env.ENV)
    // const request = {
    //   body: {}, //has missing properties
    // } as Request;

    // try {
    //      insertReachedGoalController(request,{} as Response,()=>{})
        
    // } catch (error) {
    //     expect(error).to.be.instanceof(Boolean)
    // }

  });
});
