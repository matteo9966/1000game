import * as sinon from 'sinon';
import {createJWT, fsUtils, keys, verifyJWT} from './JWT';
import {expect} from 'chai';
import { fail } from 'assert';

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAzGMqtP5EHuGcp8y+mCXCHaHROyS/aBAq30pd3cP3D9ta/wgG
8KhAiLKhd/v5ksPNsuEaSwmzDqgmPU8pTG9Nk6emMTg/j9xISCKI5T7jweycKHkj
cLpQp6WSJfdOLsMPAW0CMz4zsWGflK3BDLj2dOBDIokGlq7tMg7V1wpi7hXerwmU
fa91J0Q9Qo+vymg9srpGxRtm6n+r8/DEl3EgCHOIloHSNcP9F8/mLCRVZTzrZQbX
dlkEBlzrtNLyY6gnBfiHkj6LaDcgceiWd0nZmNwwqkbr3S0RinlcrRjzKb0as8lh
W2SLEsn/qJGkK8NAxlDnG4hyxRv4BRMD2Pjm/QIDAQABAoIBAHEd5TH8k1kABoJ7
93QfWZqqxzDTereuUvv3nZGx9lepUGhbWfPxOp4tNt4/73WBtqNsn++ts5LGDzvZ
RwMNisLQg1M0TUFiagK6UkeGEelu+VIREUM/aooOQZ+Pio6o1/IzEYeowlVGsVpI
+9H9wDEZOS6w5ZuZvp74xPLZxbz8EXZWLiSGqIPMogPomve7/hcn/Liwm9JlxUuy
ENt8+8CvspKKP/68BT6roQvCfMFmt/nQA2j3Fpkf2ExKLl4SoGMM5hkJZm0RaA3c
gnM8nLex68Y+CFFhr9GYo8KibBE/snfCxXd3gsrK6fjW6wXOsGRTYirJN33pJZDS
cUCKtQECgYEA+YSfxOvGKVSNpXZVS7TEp9UVmJKBEJTRi0PYYwJ5gSTT1hBvdcIf
lDfkguGNUjkgKFGCcMoWb9orstZUIOZ577x0lM2HTHRy93IguXGM5INNx+iVSZzX
4PkeKYU7cEBtmJnf/OBS1XGsBeeSgzP8penKhEZlmoUYUxxUOBh4pr0CgYEA0bJo
tNYe/GdKLTfr4stGwpWIBqLtpWJPTk6vfRcKN3wqLh8TbFF0CM+J7uqpPx+jNsC2
ihU62nf2r/Uc4lsTj9FUgrWWSCjZun2Ol7xrXEFuZeA09vjtWe7AUvUBElMliyAJ
TM58053YIalU+6d+SZazsd+p9fL6m0oTJTKmZUECgYEAu2+8UUJIHt4MdcJZusA1
hloUmgNb/ue8LWCu2VmPisrucvzvrcdAz6fY+dSTw7N0C7WHRlEY37dFYleM5RYd
fVDVRr7KJ03G20kZehTpoPNd55E5LA4tQSwCU3BpQR609ZCJ6T1eHEcC0YCu1+6i
mMPyRMFZK+VVa4F5ZpZDdAUCgYEAgn+l+8w5MljRZ7yidtyMZ7IJGiAxBrhcpF4B
hjZdbFRAJ729J661KHqH24B73UXCG+PodZxqqOT5R12iIRgO33SlREbfhH6vqQhU
QgfHRH2Px6S1MXGOvGYBmF7S0OWfuqowP3VNZ6CWjbREp+v/gqpfn/WSXvZckWGS
8pZHyUECgYB1phZCIZF8M/oqOTob4kS/izjrSzl/PJDPEKMxAv4p0YbAXXGEym2C
UIFH0TyLEtbMdKjCuX7++Pj/A8ltSMujauXLzTR/krFYo2iaA3Rzch988Zq6/dlC
vLRBMT8lYicpkcMpmvxzhEjUi+osh19Bk0560ZxWqGJswRaGlGCaYQ==
-----END RSA PRIVATE KEY-----
`;

const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzGMqtP5EHuGcp8y+mCXC
HaHROyS/aBAq30pd3cP3D9ta/wgG8KhAiLKhd/v5ksPNsuEaSwmzDqgmPU8pTG9N
k6emMTg/j9xISCKI5T7jweycKHkjcLpQp6WSJfdOLsMPAW0CMz4zsWGflK3BDLj2
dOBDIokGlq7tMg7V1wpi7hXerwmUfa91J0Q9Qo+vymg9srpGxRtm6n+r8/DEl3Eg
CHOIloHSNcP9F8/mLCRVZTzrZQbXdlkEBlzrtNLyY6gnBfiHkj6LaDcgceiWd0nZ
mNwwqkbr3S0RinlcrRjzKb0as8lhW2SLEsn/qJGkK8NAxlDnG4hyxRv4BRMD2Pjm
/QIDAQAB
-----END PUBLIC KEY-----
`;

describe('createJWT', () => {
  function setup() {
    const privatekeyStub = sinon.stub(keys, 'privateKey');
    const publickeyStub = sinon.stub(keys, 'publicKey');
    return {privatekeyStub, publickeyStub};
  }

  afterEach(() => {
    sinon.reset();
    sinon.restore();
  });

  it('should return a token', async () => {
    const {privatekeyStub} = setup();
    privatekeyStub.value(privateKey);
    const payload = {payload: 'stest'};
    const token = await createJWT(payload);
    expect(token).to.be.a('string');
  });

  it('should return null if no private key', async () => {
    const {privatekeyStub} = setup();
    privatekeyStub.value(null);
    const payload = {payload: 'stest'};
    const token = await createJWT(payload);
    expect(token).to.be.null;
  });
});

describe('verifyJWT', () => {
  function setup() {
    const privatekeyStub = sinon.stub(keys, 'privateKey');
    const publickeyStub = sinon.stub(keys, 'publicKey');
    return {privatekeyStub, publickeyStub};
  }
  it('should return null if there is no public key', async () => {
    const {publickeyStub} = setup();
    publickeyStub.value(null);
    const result = await verifyJWT('test');
    expect(result).to.be.null;
  });

  it('should return the payload if the token is valid', async () => {
    const {publickeyStub,privatekeyStub} = setup();
    publickeyStub.value(publicKey);
    privatekeyStub.value(privateKey);
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
