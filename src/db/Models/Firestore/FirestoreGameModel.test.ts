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

const mockUser: User = {
  gameID: '',
  goals: [],
  id: 'userid',
  name: 'random-username',
  password: 'some-random-password',
  proposed: [],
  role: 'admin',
  tempPassword: 'some-temp-password',
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

async function insertAGameAndUser(game: Game, user: User | null) {
  try {
    if (user) {
      game.players = [user.name];
      await firestoreUserModel.insertUser(user);
    }
    await firestoreGameModel.insertGame(game);
  } catch (error) {
    fail('error while inserting unser and game in the database');
  }
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

    describe('getGameByIdLookupPlayers', () => {
      it('should return a game with looked up users based on their id', async () => {
        await setup();
        const fakeGame = JSON.parse(JSON.stringify(game));
        const fakeUser = JSON.parse(JSON.stringify(mockUser));
        await insertAGameAndUser(fakeGame, fakeUser);
        const data = await firestoreGameModel.getGameByIdLookupPlayers(
          fakeGame.id
        );
        expect(data).to.not.be.null;
        expect(data?.players?.length).to.eq(1);
        const player = data?.players[0];
        expect(player?.name).to.eq(fakeUser.name);
      });
      it('should return the game with an empty array if there are no corresponding users to the username', async () => {
        await setup();
        const fakeGame = JSON.parse(JSON.stringify(game));
        fakeGame.players = ['non-existing-user'];
        await insertAGameAndUser(fakeGame, null);
        const data = await firestoreGameModel.getGameByIdLookupPlayers(
          fakeGame.id
        );
        expect(data).to.not.be.null;
        expect(data?.players.length).to.eq(0);
      });
      it('should return null if there is no game with the provided id', async () => {
        await setup();
        const data = await firestoreGameModel.getGameByIdLookupPlayers(
          'non-existing-game-id'
        );
        expect(data).to.be.null;
      });
      it('should return the looked up players without the password property', async () => {
        await setup();
        const fakeGame = JSON.parse(JSON.stringify(game));
        const fakeUser = JSON.parse(JSON.stringify(mockUser));
        await insertAGameAndUser(fakeGame, fakeUser);
        const data = await firestoreGameModel.getGameByIdLookupPlayers(
          fakeGame.id
        );
        const player = data?.players[0];
        expect(player).to.not.be.null;
        expect(player).to.not.be.undefined;
        expect(player).to.not.haveOwnProperty('password');
      });
    });

    describe('insertPlayer', () => {
      it('should insert a player in an existing game and return true', async () => {
        await setup();
        const fakeGame = JSON.parse(JSON.stringify(game));
        const username = 'some-username';
        await insertAGameAndUser(fakeGame, null);
        const result = await firestoreGameModel.insertPlayer(
          fakeGame.id,
          username
        );
        expect(result).to.be.true;
        const gameInDB = (
          await firestoreDB.collection('Games').doc(fakeGame.id).get()
        ).data() as Game;
        expect(gameInDB.players).to.contain(username);
      });
      it('should not insert a player if game does not exist and return false', async () => {
        await setup();
        const result = await firestoreGameModel.insertPlayer(
          'non-existing-game',
          'some-random-name'
        );
        expect(result).to.be.false;
      });
    });

    describe('upvoteProposedGoal', () => {
      it('should add username to votedBy list in the game if game exists and proposed goal exists', async () => {
        await setup();
        const fakeGame = JSON.parse(JSON.stringify(game)) as Game;
        const fakeProposedGoal: ProposedGoal = {
          proposedBy: '',
          votedBy: [],
          goal: JSON.parse(JSON.stringify(goal)),
          id: 'a-proposed-goal-id',
        };
        const username = 'some-random-username';
        await insertAGameAndUser(fakeGame, null);
        await firestoreGameModel.appendProposedGoals(
          [fakeProposedGoal],
          fakeGame.id
        );
        const result = await firestoreGameModel.upvoteProposedGoal(
          fakeGame.id,
          fakeProposedGoal.id,
          username
        );

        const expectedProposedGoal = {
          ...proposedGoal,
          votedBy: [username],
        };

        expect(result).to.be.true;
        const proposedGoalData = (
          await firestoreDB
            .collection('Games')
            .doc(fakeGame.id)
            .collection('proposedGoals')
            .doc(fakeProposedGoal.id)
            .get()
        ).data();

        expect(proposedGoalData).to.not.be.undefined;

        expect(proposedGoalData).to.deep.eq(expectedProposedGoal);
      });

      it('should not add username to votedBy if there is no proposedGoal', async () => {
        await setup();
        const fakeGame = JSON.parse(JSON.stringify(game)) as Game;
        await insertAGameAndUser(fakeGame, null);
        const result = await firestoreGameModel.upvoteProposedGoal(
          fakeGame.id,
          'non-existing',
          'non-existin-username'
        );
        expect(result).to.be.false;
      });
      it('should not add username to votedBy if there is no game', async () => {
        await setup();
        const result = await firestoreGameModel.upvoteProposedGoal(
          'fake.game-id',
          'non-existing',
          'non-existin-username'
        );
        expect(result).to.be.false;
      });
    });
    describe('deleteProposedGoalByGoalId', () => {
      it('should delete a proposed goal from the proposed goal collection', async () => {
        await setup();
        const fakeGame = JSON.parse(JSON.stringify(game)) as Game;
        await insertAGameAndUser(fakeGame, null);
        const fakeProposedGoal: ProposedGoal = {
          proposedBy: '',
          votedBy: [],
          goal: JSON.parse(JSON.stringify(goal)),
          id: 'a-proposed-goal-id',
        };
        await firestoreGameModel.appendProposedGoals(
          [fakeProposedGoal],
          fakeGame.id
        );

        const proposedGoalscount = (await firestoreDB
          .collection('Games')
          .doc(fakeGame.id)
          .collection('proposedGoals')
          .count()
          .get()).data();
        expect(proposedGoalscount.count,'there should be 1 proposed goal').to.eq(1);

        const result = await firestoreGameModel.deleteProposedGoalByGoalId(
          fakeGame.id,
          fakeProposedGoal.id
        );
        expect(result,'result of deletion should be true').to.be.true;
        const proposedGoalscountAfterDelete = (await firestoreDB
          .collection('Games')
          .doc(fakeGame.id)
          .collection('proposedGoals')
          .count()
          .get()).data();
        expect(proposedGoalscountAfterDelete.count).to.eq(0);
      });

      it('should return false if there is no game with provided id', async () => {
        await setup();
        const result = await firestoreGameModel.deleteProposedGoalByGoalId(
          'game-that-does-not-exist',
          'goal-that-does-not-exist'
        );
        expect(result).to.be.false;
      });
    });
    describe('removeUsernameFromProposedGoalUserUpvoteList', () => {
      it('should remove the username from votedBy list if game and collection exists', async () => {
        await setup();
        const fakeGame = JSON.parse(JSON.stringify(game)) as Game;
        const username = 'a-user-that-voted';
        await insertAGameAndUser(fakeGame, null);
        const fakeProposedGoal: ProposedGoal = {
          proposedBy: '',
          votedBy: [username],
          goal: JSON.parse(JSON.stringify(goal)),
          id: 'a-proposed-goal-id',
        };
        const proposedGoalRef = firestoreDB
          .collection('Games')
          .doc(fakeGame.id)
          .collection('proposedGoals')
          .doc(fakeProposedGoal.id);

        await firestoreGameModel.appendProposedGoals(
          [fakeProposedGoal],
          fakeGame.id
        );

        const dataBeforeUpdate = (
          await proposedGoalRef.get()
        ).data() as ProposedGoal;
        expect(dataBeforeUpdate).to.not.be.undefined;
        expect(dataBeforeUpdate.votedBy.length).to.eq(1);

        const result =
          await firestoreGameModel.removeUsernameFromProposedGoalUserUpvoteList(
            fakeGame.id,
            fakeProposedGoal.id,
            username
          );

        const data = (await proposedGoalRef.get()).data() as ProposedGoal;
        expect(result).to.be.true;
        expect(data).to.not.be.undefined;
        expect(data.votedBy.length).to.eq(0);
      });
      it('should return false if there is no game with provided id', async () => {
        await setup();
        const result =
          await firestoreGameModel.removeUsernameFromProposedGoalUserUpvoteList(
            'fake.-game',
            'fake.-id',
            'fake-username'
          );
        expect(result).to.be.false;
      });
    });
  });
}
