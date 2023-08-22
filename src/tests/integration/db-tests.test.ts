import { gameModelTests } from '../../db/Models/Game.model.test';
import { dbTests } from '../../db/tests/db.test';
import '../../setEnv';
describe.skip('DB TESTS for setup and userModel and gameModel',()=>{
    dbTests();
    gameModelTests();
})