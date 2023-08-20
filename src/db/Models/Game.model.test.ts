import {expect} from 'chai';
import {initDB, dbClient, clearDB} from '../DB';
import {gameModel} from './Game.model';
import {Game} from '../../interfaces/Game.interface';
import {Goal} from '../../interfaces/Goal.interface';
import {ProposedGoal} from '../../interfaces/ProposedGoal.interface';
import * as gameMock from '../../../mocks/mockData.json';
import {fail} from 'assert';

const gameMockData = JSON.parse(JSON.stringify(gameMock));
const game: Game = {
  description: 'test-game',
  goals: [],
  id: 'game-id',
  name: 'gamename',
  players: [],
  proposedGoals: [],
};
const goal: Goal = {
  categories: [],
  description: 'proposed goal description',
  id: 'proposed-goal-id',
  name: 'proposed-goal name',
  points: 20,
};

const proposedGoal: ProposedGoal = {
  proposedBy: 'some-user',
  goal,
  id: goal.id,
  votedBy: ['some-user'],
};
export function gameModelTests() {
  describe('gameModel tests', () => {
    async function setup() {
      initDB();
      await clearDB();
    }
    async function loadMockData() {
      return dbClient.db?.push(
        `/Games/${gameMockData.id}`,
        JSON.parse(JSON.stringify(gameMockData))
      );
    }
    it('creates a Game and appends a game', async () => {
      await setup();

      const inserted = await gameModel.insertGame(game);
      expect(inserted).to.be.true;
      const data = await dbClient.db?.getData(`/Games/${game.id}`);
      expect(data).to.not.be.undefined;
      expect(data['id']).to.eq(game.id);
    });
    it('adds a proposed goal to an existing game', async () => {
      await setup();
      await gameModel.insertGame(game);
      const appended = await gameModel.appendProposedGoals(
        [proposedGoal],
        game.id
      );
      expect(appended).to.be.true;
      const data = await dbClient.db?.getData(`/Games/${game.id}`);
      expect(data?.proposedGoals?.length).to.equal(1);
    });
    describe('tests with loaded mocked data', () => {
      it('should load the mocked data ', async () => {
        await setup();
        await loadMockData();
        const data = await dbClient.db?.getData('/Games');
        expect(data).to.haveOwnProperty(gameMock?.['id']);
      });

      describe('upvoteProposedGoal', () => {
        it('should add a username to the votedBy list of proposed goal', async () => {
          const gameID = gameMockData.id;
          const proposedGoal = gameMockData.proposedGoals?.[0];
          const username = 'username-random-name-1';
          if (!proposedGoal) {
            fail('add a proposed goal to the gameMock for tests!');
          }
          await setup();
          await loadMockData();
          const inserted = await gameModel.upvoteProposedGoal(
            gameID,
            proposedGoal.id,
            username
          );
          expect(inserted).to.be.true;

          const updatedProposedGoal = (await dbClient.db?.getData(
            `/Games/${gameID}/proposedGoals[0]`
          )) as ProposedGoal;

          expect(updatedProposedGoal.votedBy).to.include(username);
        });
      });

      describe('removeUsernameFromProposedGoalUserUpvoteList', () => {
        it('should remove the user from the list of votedBy list if username is in the list', async () => {
          initDB();
          const gameID = gameMockData.id;
          const proposedGoal = gameMockData.proposedGoals?.[0];
          const username = 'USERNAME-TEST-1';
          if (!proposedGoal) {
            fail('add a proposed goal to the gameMock for tests!');
          }
          initDB();
          await dbClient.db?.delete('/');
          await loadMockData();
          await dbClient.db?.push(
            `/Games/${gameID}/proposedGoals[0]/votedBy[]`,
            username
          );
          const game = (await dbClient.db?.getData(
            `/Games/${gameID}/`
          )) as Game;
          expect(game.proposedGoals[0].votedBy).to.include(username);
          const removed =
            await gameModel.removeUsernameFromProposedGoalUserUpvoteList(
              gameID,
              proposedGoal.id,
              username
            );
          const updatedgame = (await dbClient.db?.getData(
            `/Games/${gameID}`
          )) as Game;
          expect(removed).to.be.true;
          expect(game.proposedGoals.length).to.be.greaterThan(0);
          expect(updatedgame.proposedGoals[0].votedBy).to.not.include(username);
        });
      });
    });
  });
}
