import * as express from 'express';
import * as request from 'supertest';
import * as sinon from 'sinon';
import * as chaiAsPromised from 'chai-as-promised';
import * as chai from 'chai';
import {insertGameController} from '../../controllers/game-controllers/insertGame.controller';
import {
  addAccessTokenMiddleware,
  utils,
} from '../../middleware/addAccessToken.middleware';
import {userModel} from '../../db/Models/modelInstances';
import {gameModel} from '../../db/Models/modelInstances';

chai.use(chaiAsPromised);
const app = express();
app.use(express.json());
app.post('/insert-game', insertGameController, addAccessTokenMiddleware);

describe('insert-game-route', () => {
  let findByNameStub: sinon.SinonStub;
  let addGameIdToUserStub: sinon.SinonStub;
  let insertGameStub: sinon.SinonStub;

  function setup() {
    sinon.reset();
    sinon.restore();
    findByNameStub = sinon.stub(userModel, 'findByName');
    addGameIdToUserStub = sinon.stub(userModel, 'addGameIdToUser');
    insertGameStub = sinon.stub(gameModel, 'insertGame');
  }

  it('should add a session token when making a request to insert-game', async () => {
    setup();
    addGameIdToUserStub.resolves(true);
    insertGameStub.resolves(true);
    findByNameStub.returns(
      Promise.resolve({
        goals: [],
        id: 'id',
        name: 'name',
        proposed: [],
        role: 'admin',
        gameID: null,
      })
    );

    const createJWTStub = sinon.stub(utils, 'createJWT');
    createJWTStub.resolves('somejwt');

    const response = await request(app).post('/insert-game').send({username: 'username', game: {id: 'game-id-game-id'}}).set('Accept', 'application/json');

    const authorizationHeader = response.headers['authorization'];
    chai.expect(authorizationHeader).to.contain('somejwt');
  });
});
