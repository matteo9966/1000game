import {insertProposedGoalsController} from './insertGoals.controller';
import * as sinon from 'sinon';
import {gameModel} from '../../db/Models/Game.model';
import {Request, Response} from 'express';
import * as chai from 'chai';
import {CustomServerError} from '../../errors/CustomServerError';
import {InsertProposedGoalsRequest} from '../../interfaces/Requests/InsertProposedGoalsRequest';
import {Game} from '../../interfaces/Game.interface';
const expect = chai.expect;
describe('insertProposedGoalsController', function () {
  function setupFunction() {
    let findById: sinon.SinonStub;
    let getGameById: sinon.SinonStub;
    let appendPropgoalsStub: sinon.SinonStub;
    const end = sinon.spy() as Response['end'];
    const status = sinon.spy() as Response['status'];
    findById = sinon.stub(gameModel, 'findById');
    sinon.stub(gameModel, 'findByName');
    sinon.stub(gameModel, 'appendGoals');
    getGameById = sinon.stub(gameModel, 'getGameById');
    appendPropgoalsStub = sinon.stub(gameModel, 'appendProposedGoals');
    const json = sinon.spy() as Response['json'];

    return {findById, appendPropgoalsStub, getGameById, end, status, json};
  }

  this.afterEach(() => {
    sinon.reset();
    sinon.restore();
  });

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
          body: {goals: [], gameId: 'gameid', username: 'userid'},
        } as unknown as Request,
        {status: status, end: end} as Response,
        () => {}
      );
    } catch (error) {}
    sinon.assert.calledWith(status as sinon.SinonSpy, 200);
    sinon.assert.calledOnce(end as sinon.SinonSpy);
  });

  it('should add proposed goal given an array of goals in the body request', async function () {
    const {findById, appendPropgoalsStub, getGameById, end, status, json} =
      setupFunction();

    const foundGame: Game = {
      description: 'game description',
      goals: [],
      id: 'gameid',
      name: 'stubgame',
      players: ['userid'],
      proposedGoals: [],
    };

    findById.resolves(foundGame);
    appendPropgoalsStub.resolves(true);
    getGameById.resolves(true);

    const reqBody: InsertProposedGoalsRequest = {
      gameId: 'gameid',
      goals: [
        {
          categories: [],
          description: 'goalDescription',
          id: '', //ID???
          name: 'goalName',
          points: 20,
        },
      ],
      username: 'userid',
    };

    await insertProposedGoalsController(
      {
        body: reqBody,
      } as unknown as Request,
      {status: status, end: end, json} as Response,
      () => {}
    );

    const expectedGoalsArg = reqBody.goals.map(g => ({
      proposedBy: reqBody.username,
      votedBy: [],
      goal: sinon.match.any,
      id: sinon.match.any,
    }));

    // console.log(expectedGoalsArg)

    sinon.assert.calledWithMatch(
      appendPropgoalsStub,
      expectedGoalsArg,
      reqBody.gameId
    );
  });
});
