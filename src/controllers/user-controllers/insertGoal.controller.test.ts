//TODO:
import {Request, Response} from 'express';
import {insertReachedGoalController} from './insertGoal.controller';
import * as chai from 'chai';
import {CustomServerError} from '../../errors/CustomServerError';
import {gameModel} from '../../db/Models/Game.model';
import * as sinon from 'sinon';
import {Game} from '../../interfaces/Game.interface';
const expect = chai.expect;

describe('insertReachedGoalController Test', function () {
  afterEach(() => {
    sinon.reset();
    sinon.restore();
  });
  it('should throw a customServer error if missing goalId name or gameId in body', async function () {
    const body = {};
    const request = {body} as Request;
    const response = {} as Response;
    try {
      await insertReachedGoalController(request, response, () => {});
    } catch (error) {
      expect(error).to.be.instanceof(CustomServerError);
    }
  });

  it('should throw if no game with provide id', async function () {
    const body = {gameId: 'id', name: 'name', goalId: 'goalID'};
    const request = {body} as Request;
    sinon.stub(gameModel, 'getGameById').resolves(null as unknown as Game);

    try {
      await insertReachedGoalController(request, {} as Response, () => {});
    } catch (error) {
      expect(error).to.be.instanceof(CustomServerError);
    }
  });

  describe('valid gameId', function () {
    beforeEach(() => {
      sinon.stub(gameModel, 'getGameById').resolves({
        description: 'game desc',
        goals: [],
        id: 'id',
        name: 'name',
        players: ['name'],
        proposedGoals: [],
      });
    });

    it('should throw if no user with provided username', async function () {
      const body = {gameId: 'id', name: 'invalid-name', goalId: 'goalID'};
      const request = {body} as Request;
      try {
        await insertReachedGoalController(request, {} as Response, () => {});
      } catch (error) {
        expect(error).to.be.instanceOf(CustomServerError);
        expect(error).to.have.property('statusCode');
        expect((error as CustomServerError).statusCode).to.eq(400);
      }
    });

    
  });
});
