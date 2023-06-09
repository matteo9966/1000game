import { DB,dbClient } from "../DB";
import { Model } from "./Model";

class TestModel extends Model{
    constructor(db:DB,name:string){
        super(db,name);
    }
}

export const testModel = dbClient.createModel<TestModel>(TestModel,'Test1')


