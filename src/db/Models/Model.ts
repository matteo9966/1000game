import {JsonDB} from 'node-json-db';
import {DB} from '../DB';
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
  async insert(path: string, value: any, ovverride = false) {
    if (!this.db) {
      return false;
    }
    try {
      const fullPath = `/${this.name}${path}`;
      await this.db.push(fullPath, value, ovverride);
      return true;
    } catch (error) {
      //log error
      return false;
    }
  }

  /**
   * Returns null if the path does not exist
   *
   * @param path
   * @returns
   */
  async get<T>(path: string) {
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

  async delete(path: string) {
    const fullPath = `/${this.name}${path}`;
    //TODO
  }

  get db() {
    return this._db?.db;
  }
}
