import {JsonDB, Config} from 'node-json-db';
import {existsSync} from 'fs';
import { environment } from '../config/environment';
type ClassModel = {new (db:DB,name:string):{}}

export class DB {
  db: JsonDB | null = null;
  constructor() {}
  /**
   * 
   * @param dbName the name without any extension, .json is added automatically
   * @param onPush 
   * @param readable 
   * @param separator 
   */
  initializeDB(
    dbName: string,
    onPush = true,
    readable = true,
    separator = '/'
  ) {
    const db =  new JsonDB(new Config(`${dbName}_${environment.env}`, onPush, readable, separator)); 
    this.db=db;
  }

  createModel<T>(classModel:ClassModel,name:string){
    return new classModel(this,name) as T;
  }


}


export const dbClient = new DB();
export function initDB(){
  try {
    dbClient.initializeDB(environment.dbname);
  } catch (error) {
    console.log(error)
  }
  
}

