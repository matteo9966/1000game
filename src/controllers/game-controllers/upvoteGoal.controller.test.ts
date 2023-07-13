import {upvoteGoalController} from './upvoteGoal.controller';
import * as gameMock from '../../../mocks/gameWithProposedGoalsMock.json';
import * as sinon from 'sinon';
import {gameModel} from '../../db/Models/Game.model';
import {expect} from 'chai';
import {Request, Response} from 'express';
import {CustomServerError} from '../../errors/CustomServerError';
import {Game} from '../../interfaces/Game.interface';
import {fail} from 'assert';
import { Goal } from '../../interfaces/Goal.interface';
import { ProposedGoal } from '../../interfaces/ProposedGoal.interface';
describe('upvoteGoalController', () => {
  function setup() {
    const findById = sinon.stub(gameModel, 'findById');
    const appendGoals = sinon.stub(gameModel, 'appendGoals');
    const getProposedGoalIndex = sinon.stub(gameModel, 'getProposedGoalIndex');
    const deleteProposedGoal = sinon.stub(gameModel, 'deleteProposedGoal');
    const upvoteProposedGoal = sinon.stub(gameModel, 'upvoteProposedGoal');
    const getGameById = sinon.stub(gameModel, 'getGameById');
    const json = sinon.spy() as Response['json'];
    return {
      findById,
      appendGoals,
      getProposedGoalIndex,
      deleteProposedGoal,
      upvoteProposedGoal,
      getGameById,
      json,
    };
  }
  beforeEach(() => {});
  afterEach(() => {
    sinon.reset();
    sinon.restore();
  });
  it('should throw if user is not part of game', async function () {
    const {findById} = setup();
    findById.resolves(gameMock);
    const invalidId = 'invalid-user-id111111';

    try {
      await upvoteGoalController(
        {
          body: {
            gameId: 'gameid',
            goalId: 'goalId',
            username: invalidId,
          },
        } as Request,
        {} as Response,
        () => {}
      );
    } catch (error) {
      expect(error).to.be.instanceOf(CustomServerError);
    }
  });

  it('should throw if user created the goal and tries to vote for it', async function () {
    try {
      const {findById} = setup();
      const gameMockCopy = JSON.parse(JSON.stringify(gameMock)) as Game;
      const username = 'username-1';
      gameMockCopy.proposedGoals.push({
        goal: {
          categories: [],
          description: 'goal description',
          id: 'goalid-test',
          name: 'name',
          points: 300,
        },
        id: 'goal-id',
        proposedBy: username,
        votedBy: [],
      });
      gameMockCopy.players.push(username);
      findById.resolves(gameMockCopy);

      await upvoteGoalController(
        {
          body: {
            gameId: 'gameid-test',
            goalId: 'goalid-test',
            username: username,
          },
        } as Request,
        {} as Response,
        () => {}
      );
    } catch (error) {
      if (error instanceof CustomServerError) {
        expect(error.message).to.equal(
          "You created this goal so you can't vote for it"
        );
      } else {
        fail();
      }
    }
  });
 
  it('should append goal to goals if the voters are at least 50% of the players', async () => {
    const {
      findById,
      appendGoals,
      getProposedGoalIndex,
      deleteProposedGoal,
      upvoteProposedGoal,
      getGameById,
      json
    } = setup();
    const username = 'username1';
    const goalId = 'goal-id';
    const gameMockCopy = JSON.parse(JSON.stringify(gameMock)) as Game;
    gameMockCopy.players = [];
    gameMockCopy.players.push(...['p1', 'p2', 'p3', username]);
    gameMockCopy.proposedGoals = [];
    gameMockCopy.proposedGoals.push({
      goal: {
        categories: [],
        description: '',
        id: goalId,
        name: 'goal',
        points: 2,
      },
      id: goalId,
      proposedBy: 'some-random-player',
      votedBy: [...['p1']],
    });

    findById.resolves(gameMockCopy);
    appendGoals.resolves(true);
    getProposedGoalIndex.resolves(1);
    deleteProposedGoal.resolves(true);
    upvoteProposedGoal.resolves();
    getGameById.resolves({} as Game);
    
    await upvoteGoalController(
      {
        body: {
          gameId: 'gameid-test',
          goalId: goalId,
          username: username,
        },
      } as Request,
      {json} as Response,
      () => {}
    );

    sinon.assert.calledOnce(appendGoals)
    sinon.assert.notCalled(upvoteProposedGoal)
    sinon.assert.calledOnce(getGameById)

  });
});
