import {expect} from 'chai';
import {firestoreUserModel} from './FirestoreUserModel';
import {firestoreDB} from '../../firebase/firebase';
import * as superagent from 'superagent';
import {User} from '../../../interfaces/User.interface';
import {Game} from '../../../interfaces/Game.interface';
import {Goal} from '../../../interfaces/Goal.interface';
import {firestoreGameModel} from './FirestoreGameModel';
import {fail} from 'assert';
import {ProposedGoal} from '../../../interfaces/ProposedGoal.interface';
const game: Game = {
  name: 'test-game-name',
  description: 'test-game-description',
  players: [],
  goals: [],
  proposedGoals: [],
  id: 'test-game-id-0',
};

const goal: Goal = {
  name: 'test-goal',
  description: 'description of the test goal',
  id: 'random-id-of-test-goal',
  points: 0,
  categories: [],
};
const goal2: Goal = {
  name: 'test-goal-the-second-one',
  description: 'description of the test goal',
  id: 'random-id-of-test-goal-2',
  points: 0,
  categories: [],
};

const proposedGoal: ProposedGoal = {
  proposedBy: '',
  votedBy: [],
  goal: JSON.parse(JSON.stringify(goal)),
  id: 'a-proposed-goal-id',
};

async function insertAGame() {
  const game: Game = {
    name: 'test-game-name',
    description: 'test-game-description',
    players: [],
    goals: [],
    proposedGoals: [],
    id: 'test-game-id-0',
  };

  const newGame = JSON.parse(JSON.stringify({...game}));
  await firestoreGameModel.insertGame(newGame);
  return newGame as Game;
}

async function clearFirestore() {
  const endpoint =
    'http://localhost:8080/emulator/v1/projects/goals-database/databases/(default)/documents';

  try {
    const response = await superagent.delete(endpoint);
    if (response.ok) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export function firestoreGameModelTests() {
  async function setup() {
    return clearFirestore();
  }

  async function getGameDataById(id: string) {
    try {
      const dbGame = await firestoreDB.collection('Games').doc(id).get();
      return dbGame.data() as Game;
    } catch (error) {
      fail('failed to fetch the game from the database');
    }
  }

  describe('FirestoreGameModel', () => {
    describe('insertGame', () => {
      it('should insert a game and return true if inserted', async () => {
        await setup();
        const newGame = {...game};
        const result = await firestoreGameModel.insertGame(newGame);
        expect(result).to.be.true;
        const dbGame = await firestoreDB
          .collection('Games')
          .doc(newGame.id)
          .get();
        expect(dbGame.data()).to.deep.equal(newGame);
      });
      it('should not insert a game if there is a game with the same id', async () => {
        await setup();
        const newGame = {...game};
        const sameAsNewGame = {
          ...newGame,
          description: 'this-is-the-second-one',
        };
        const resultInsertNewGame = await firestoreGameModel.insertGame(
          newGame
        );
        expect(
          resultInsertNewGame,
          'inserting the game the first time should work'
        ).to.be.true;
        const resultInsertSameGame = await firestoreGameModel.insertGame(
          sameAsNewGame
        );
        expect(
          resultInsertSameGame,
          'should be false when inserting a game with same ID'
        ).to.be.false;
        const games = await firestoreDB.collection('Games').get();
        const nOfGames = games.docs
          .map(d => d.data)
          .reduce((prev, curr) => ++prev, 0);
        expect(nOfGames).to.eq(1);
      });

      describe('Insert game with goals', () => {
        it('should insert the goals in a sub collection inside the game', async () => {
          await setup();
          const newGame = {...game};
          newGame.goals.push({...goal}, {...goal2});
          const result = await firestoreGameModel.insertGame(newGame);
          expect(result).to.be.true;
          const dbGame = await firestoreDB
            .collection('Games')
            .doc(newGame.id)
            .get();
          expect(dbGame.data()).to.deep.equal(newGame);
          const goalsSubRef = firestoreDB
            .collection('Games')
            .doc(newGame.id)
            .collection('goals');
          const goalsCollection = await goalsSubRef.get();
          const goalsData = goalsCollection.docs.map(doc => doc.data());
          expect(goalsData.length).to.eq(2);
        });
      });
    });
    describe('appendGoals', () => {
      async function getGoalsSubCollection(gameId: string) {
        try {
          const goals = (
            await firestoreDB
              .collection('Games')
              .doc(gameId)
              .collection('goals')
              .get()
          ).docs.map(doc => doc.data());
          return goals;
        } catch (error) {
          fail();
        }
      }
      it('should append a goal to an existing game', async () => {
        await setup();
        const insertedGame = await insertAGame();
        const goalCopy = {...goal};
        const result = await firestoreGameModel.appendGoals(
          [goalCopy],
          insertedGame.id
        );
        expect(result, 'should add a goal to a game').to.be.true;
        const goals = await getGoalsSubCollection(insertedGame.id);
        expect(goals.length).to.eq(1);
        expect(goals[0]).to.deep.eq(goalCopy);
      });
      it('should not append goal if the game does not exist', async () => {
        await setup();
        const result = await firestoreGameModel.appendGoals(
          [{...goal}],
          'non-existing-game'
        );
        expect(result).to.be.false;
      });
    });
    describe('appendProposedGoals', () => {
      async function getProposedGoalsSubCollection(gameID: string) {
        try {
          const proposedGoalsRef = firestoreDB
            .collection('Games')
            .doc(gameID)
            .collection('proposedGoals');
          const data = (await proposedGoalsRef.get()).docs.map(doc =>
            doc.data()
          );
          return data as ProposedGoal[];
        } catch (error) {
          fail();
        }
      }

      it('should append a proposed goal to an existing game', async () => {
        const insertedGame = await insertAGame();
        const mockProposedGoal = {...proposedGoal};
        const inserted = await firestoreGameModel.appendProposedGoals(
          [mockProposedGoal],
          insertedGame.id
        );
        expect(inserted).to.be.true;
        const proposedGols = await getProposedGoalsSubCollection(
          insertedGame.id
        );
        expect(proposedGols.length).to.eq(1);
        expect(proposedGols[0]).to.deep.eq(mockProposedGoal);
      });

      it('should not append a goal to a non existing game', async () => {
        const mockProposedGoal = {...proposedGoal};
        const inserted = await firestoreGameModel.appendProposedGoals(
          [mockProposedGoal],
          'some-non-existing-game-id'
        );
        expect(inserted).to.be.false;
      });
    });

    describe('getGameById', () => {
      it('should return a game that exists', async () => {
        const insertedGame = await insertAGame();
        const game = await firestoreGameModel.getGameById(insertedGame.id);
        expect(game).to.not.be.null;
        expect(game).to.deep.eq(insertedGame);
      });
      it('should not return anything if the game does', async () => {
        const game = await firestoreGameModel.getGameById('non-existing-id');
        expect(game).to.be.null;
      });
    });
  });
}
