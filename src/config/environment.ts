import {config} from 'dotenv'
config();

//all the environment variables here!

export const environment = {
 basepath:process.env.BASEPATH,
 port:process.env.PORT,
 env:process.env.ENV,
 dbname:process.env.DBNAME
}