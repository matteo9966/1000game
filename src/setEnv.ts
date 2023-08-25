import {config} from 'dotenv';
import {environment, initEnvironment} from './config/environment';
let pth = '';

switch (process.env.NODE_ENV?.trim()) {
  case 'dev':
    pth = `.env`;
    break;
  case 'test':
    pth = 'test.env';
    console.log('.env.test is the right one');
    break;
  case 'prod':
    pth = '.env';
    break;

  default:
    break;
}

function setConfig() {
  const {parsed, error} = config({ debug: true, override: true});
  if (error || !parsed) {
    console.log(
      'Error while parsing the environment variables, please set env variables'
    );
    process.exit(1);
  }
  initEnvironment(parsed);
  console.log('environment parsed successfully!',
  JSON.stringify({env:environment.env,FIRESTORE_EMULATOR_HOST:environment.firebase}))
}

setConfig();

export {};
