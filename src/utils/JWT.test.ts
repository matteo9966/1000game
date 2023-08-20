import * as sinon from 'sinon';
import {createJWT,  verifyJWT} from './JWT';
import {expect} from 'chai';
import { fail } from 'assert';
import { environment } from '../config/environment';


describe('createJWT', () => {


  afterEach(() => {
    sinon.reset();
    sinon.restore();
  });

  it('should return a token', async () => {
    const payload = {payload: 'stest'};
    const token = await createJWT(payload);
    expect(token).to.be.a('string');
  });

  it('should return null if no private key', async () => {
    sinon.stub(environment,'privatekey').value(null)
    expect(environment.privatekey).to.be.null;
    const payload = {payload: 'stest'};
    const token = await createJWT(payload);
    expect(token).to.be.null;
  });
});

describe('verifyJWT', () => {

  afterEach(() => {
    sinon.reset();
    sinon.restore();
  });
  
  it('should return null if there is no public key', async () => {

    sinon.stub(environment,'publickey').value(null);
    const result = await verifyJWT('test');
    expect(result).to.be.null;
  });

  it('should return the payload if the token is valid', async () => {

    const payload = {payload: 'stest'};
    const token = await createJWT(payload);
    if(!token){
      fail('the token was not creted');
    }
    const result:any = await verifyJWT(token);
    expect(result).to.have.property('payload');
    expect((result?.['payload'])).to.equal('stest');
  })
});
