import dotenv from 'dotenv';
import * as sinon from 'sinon';
export const mochaHooks = {
  beforeEach() {
    dotenv.config({path: 'test.env'});
  },
  afterEach() {
    sinon.restore();
    sinon.reset();
  },
  after() {
    sinon.restore();
    sinon.reset();
  },
};
