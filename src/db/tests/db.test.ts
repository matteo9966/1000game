import {expect} from 'chai';
import {initDB, dbClient, clearDB} from '../DB';
export function dbTests(){
    describe('initialization: testDB', () => {
     async function setup() {
        // console.log('environment variables: \n', environment);
        initDB();
        await clearDB();
      }
      it('initializes the db', async () => {
        await setup();
        //it sets up the data:
        await dbClient.db?.push('/Test/data1', {test: true});
        const data = await dbClient.db?.getData('/Test/data1');
        expect(data).to.haveOwnProperty('test');
        expect(data?.['test']).to.be.true;
      });
    });
}
