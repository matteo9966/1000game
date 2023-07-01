import { Category } from "./Category.interface";

export interface Goal{
    name:string;
    description:string;
    id:string;
    points:number;
    categories:string[]
}