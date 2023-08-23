import {upvoteGoalController} from './upvoteGoal.controller';
import * as gameMock from '../../../mocks/mockData.json';
import * as sinon from 'sinon';
import {gameModel} from '../../db/Models/modelInstances';
import {expect} from 'chai';
import {Request, Response} from 'express';
import {CustomServerError} from '../../errors/CustomServerError';
import {Game} from '../../interfaces/Game.interface';
import {fail} from 'assert';
describe('upvoteGoalController', () => {
  function setup() {
    
    const appendGoals = sinon.stub(gameModel, 'appendGoals');

    const upvoteProposedGoal = sinon.stub(gameModel, 'upvoteProposedGoal');
    const deleteProposedGoalByGoalId = sinon.stub(gameModel,'deleteProposedGoalByGoalId');
    const removeUsernameFromProposedGoalUserUpvoteList = sinon.stub(
      gameModel,
      'removeUsernameFromProposedGoalUserUpvoteList'
    );
    const getGameById = sinon.stub(gameModel, 'getGameById');
    const json = sinon.spy() as Response['json'];
    return {
      
      appendGoals,
      deleteProposedGoalByGoalId,
      upvoteProposedGoal,
      getGameById,
      removeUsernameFromProposedGoalUserUpvoteList,
      json,
    };
  }
  beforeEach(() => {});
  afterEach(() => {
    sinon.reset();
    sinon.restore();
  });
  it('should throw if user is not part of game', async function () {
    const {getGameById} = setup();
    getGameById.resolves(gameMock);
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
      const {getGameById} = setup();
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
      getGameById.resolves(gameMockCopy);

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
      deleteProposedGoalByGoalId,
      appendGoals,
      upvoteProposedGoal,
      getGameById,
      json,
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
    deleteProposedGoalByGoalId.resolves(true);
    getGameById.resolves(gameMockCopy);
    appendGoals.resolves(true);
    upvoteProposedGoal.resolves();

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

    sinon.assert.calledOnce(appendGoals);
    sinon.assert.notCalled(upvoteProposedGoal);
  });

  describe('removing the vote from an upvoted proposedGoal', () => {
    it('should remove the username from the votedBy array', async () => {
      const {
        appendGoals,
        deleteProposedGoalByGoalId,
        upvoteProposedGoal,
        getGameById,
        json,
        removeUsernameFromProposedGoalUserUpvoteList
      } = setup();
      const username = 'test-username-that-i-add';
      const goalId = 'goal-id';
      const gameMockCopy = JSON.parse(JSON.stringify(gameMock)) as Game;
      gameMockCopy.proposedGoals.push({
        goal: {
          categories: [],
          description: 'goal description',
          id: goalId,
          name: 'name',
          points: 300,
        },
        id: 'goal-id',
        proposedBy: 'some-admin',
        votedBy: [username], //add the username
      });
      gameMockCopy.players.push(username);

      const request = {
        body: {
          gameId: 'gameid-test',
          goalId: goalId,
          username: username,
        },
      } as Request;

      getGameById.resolves(gameMockCopy);
       
      removeUsernameFromProposedGoalUserUpvoteList.resolves(true);
      upvoteProposedGoal.resolves();
      removeUsernameFromProposedGoalUserUpvoteList.resolves(true)
      getGameById.resolves(gameMockCopy);

      await upvoteGoalController(request, {json} as Response, () => {});
      sinon.assert.calledOnce(removeUsernameFromProposedGoalUserUpvoteList);

    });
  });
});
