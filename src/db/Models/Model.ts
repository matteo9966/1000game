import {JsonDB} from 'node-json-db';
import {DB} from '../DB';
import {logger, logger2} from '../../logger/winston.logger';
import {basename} from 'path';
export class Model {
  private _db: DB | null = null;
  constructor(db: DB, private name: string) {
    this._db = db;
  }

  /**
   * @example pushing into an array:
   * ```
   * await db.push("/arraytest/myarray[0]", {
   *  obj:'test'
   * }, true);
   * ```
   * to append to an array:
   * ```
   * await db.push("/arraytest/myarray[]", {
   * obj:'test'
   * }, true);
   * ```
   *
   * @param path
   * @param value
   * @returns
   */
  protected async insert(path: string, value: any, ovverride = false) {
    if (!this.db) {
      return false;
    }
    try {
      const fullPath = `/${this.name}${path}`;
      await this.db.push(fullPath, value, ovverride);
      return true;
    } catch (error) {
      //log error
      logger2(error, basename(__filename));
      return false;
    }
  }

  /**
   * Returns null if the path does not exist
   *
   * @param path
   * @returns
   */
  protected async get<T>(path: string) {
    if (!this.db) return null;
    try {
      const fullPath = `/${this.name}${path}`;
      return this.db.getObject<T>(fullPath);
    } catch (error) {
      return null;
    }
  }

  async findById<T>(id: string) {
    if (!this.db) {
      return null;
    }

    if (!id) {
      return null;
    }

    try {
      const fullPath = `/${this.name}/${id}`;
      const result = (await this.db.getObject(fullPath)) as T;
      return result;
    } catch (error) {
      return null;
    }
  }

  /**
   * @description find by name uses the  user name as an id
   * @param id
   * @returns
   */
  async findByName<T>(id: string) {
    if (!this.db) {
      return null;
    }

    if (!id) {
      return null;
    }

    try {
      const fullPath = `/${this.name}/${id}`;
      const result = (await this.db.getObject(fullPath)) as T;
      return result;
    } catch (error) {
      return null;
    }
  }

  /**
   *
   * @param path a path starting with /
   */
  async getIndex(path: string, searchValue: string, propertyName?: string) {
    if (!this.db) {
      return -1;
    }

    try {
      const fullpath = `/${this.name}${path}`;
      const index = await this.db.getIndex(fullpath, searchValue, propertyName);
      return index;
    } catch (error) {
      logger2(error, __filename);
      return -1;
    }
  }

  async getIndexValue(path: string, value: any) {
    if (!this.db) {
      return -1;
    }
    try {
      const fullpath = `/${this.name}${path}`;
      const index = this.db.getIndexValue(fullpath, value);
      return index;
    } catch (error) {
      logger2(error, __filename);
      return -1;
    }
  }

  /**
   *
   * @param path a path starting with /
   */
  protected async delete(path: string) {
    const fullPath = `/${this.name}${path}`;
    if (!this.db) return false;
    try {
      await this.db.delete(fullPath);
      return true;
    } catch (error) {
      logger2(error, __filename);
      return false;
    }
  }

  protected get db() {
    return this._db?.db;
  }
}
