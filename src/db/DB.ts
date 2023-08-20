import {JsonDB, Config} from 'node-json-db';
import {environment} from '../config/environment';
import {logger2} from '../logger/winston.logger';


type ClassModel = {new (db: DB, name: string): {}};

export class DB {
  db: JsonDB | null = null;
  dbFileName:string|null=null;
  constructor() {}
  /**
   *
   * @param dbName the name without any extension, .json is added automatically
   * @param onPush
   * @param readable
   * @param separator
   */
  initializeDB(
    dbName?: string | undefined,
    onPush = true,
    readable = true,
    separator = '/'
  ) {
    if (!dbName) {
      logger2('provide a db name for the db', __filename);
      process.exit(0);
    }

    this.dbFileName = `${dbName}_${environment.env}.json`

    const db = new JsonDB(
      new Config(`${dbName}_${environment.env}`, onPush, readable, separator)
    );
    this.db = db;
  }

  createModel<T>(classModel: ClassModel, name: string) {
    return new classModel(this, name) as T;
  }
}

export const dbClient = new DB();

export function initDB() {
  try {
    dbClient.initializeDB(environment.dbname);
    return true
  } catch (error) {
    console.log(error);
    return false
  }
}



export async function clearDB() {
  try {
    if (environment.env === 'test') {
      await dbClient.db?.delete('/Games/');
      await dbClient.db?.reload();
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}
