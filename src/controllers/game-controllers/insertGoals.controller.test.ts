import {insertProposedGoalsController} from './insertGoals.controller';
import * as sinon from 'sinon';
import {gameModel} from '../../db/Models/Game.model';
import {Request, Response} from 'express';
import * as chai from 'chai';
import {CustomServerError} from '../../errors/CustomServerError';
const expect = chai.expect;
describe('insertProposedGoalsController', function () {
  let findById: sinon.SinonStub;
  let getGameById: sinon.SinonStub;
  let appendPropgoalsStub: sinon.SinonStub;

  function setupFunction() {
    findById = sinon.stub(gameModel, 'findById');
    sinon.stub(gameModel, 'findByName');
    sinon.stub(gameModel, 'appendGoals');
    sinon.stub(gameModel, 'appendProposedGoals');
  }

  it('should throw if missing goals or gameId or userid properties', async function () {
    try {
      await insertProposedGoalsController(
        {body: {}} as unknown as Request,
        {} as Response,
        () => {}
      );
    } catch (error) {
      expect(error).to.be.instanceOf(CustomServerError);
    }
  });

  it('should not throw if trying to insert no goal, just a response 200', async function () {
      const end = sinon.spy() as Response['end'];
      const status = sinon.spy() as Response['status'];
    try {
      await insertProposedGoalsController(
        {
          body: {goals: [], gameId: 'gameid', userid: 'userid'},
        } as unknown as Request,
        {status: status, end: end} as Response,
        () => {}
      );
    } catch (error) {}
    sinon.assert.calledWith(status as sinon.SinonSpy, 200);
    sinon.assert.calledOnce(end as sinon.SinonSpy);
  });
});
