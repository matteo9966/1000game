import {upvoteGoalController} from './upvoteGoal.controller';
import * as gameMock from '../../../mocks/gameWithProposedGoalsMock.json';
import * as sinon from 'sinon';
import {gameModel} from '../../db/Models/Game.model';
import {expect} from 'chai';
import {Request, Response} from 'express';
import {CustomServerError} from '../../errors/CustomServerError';
import {Game} from '../../interfaces/Game.interface';
import {fail} from 'assert';
describe('upvoteGoalController', () => {
  function setup() {
    const findById = sinon.stub(gameModel, 'findById');
    return {findById};
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
      gameMockCopy.players.push(username)
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
});
