import dotenv from 'dotenv';
export const mochaHooks = {
    beforeEach(){
       dotenv.config({path:'test.env'})
       console.log("process.env.ENV",process.env.ENV)
    }
  };