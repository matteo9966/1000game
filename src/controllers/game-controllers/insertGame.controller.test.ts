import {expect} from 'chai';
import {gameModel} from '../../db/Models/Game.model';
import {userModel} from '../../db/Models/User.model';
import {insertGameController} from './insertGame.controller';
import * as sinon from 'sinon';
import * as chaiAsPromised from 'chai-as-promised';
import * as chai from 'chai';
import {Request, Response} from 'express';
chai.use(chaiAsPromised);

describe('insertGameController', () => {
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

  it('should throw if user already created a game', async () => {
    setup();
    findByNameStub.returns(
      Promise.resolve({
        goals: [],
        id: 'id',
        name: 'name',
        proposed: [],
        role: 'admin',
        gameID: 'somegameid',
      })
    );

    const reqBody = {
      body: {username: 'someusername', game: {}},
    } as unknown as Request;

    await expect(insertGameController(reqBody, {} as Response, () => {})).to.be
      .rejected;
  });

  it('should populate res.locals.payload and res.locals.authorizationPayload and call next if successfull', async () => {
    const requestBody = {username: 'xxxxxx', game: {id: 'somegameid'}};
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
    const nextSpy = sinon.spy();
    const localsObj = {}
    await insertGameController(
      {body: requestBody} as unknown as Request,
      {locals:localsObj} as unknown as Response,
      nextSpy
    );
    expect(localsObj).to.haveOwnProperty('payload');
    expect(localsObj).to.haveOwnProperty('authorizationPayload');
    expect(nextSpy.calledOnce).to.be.true;
  });

});
