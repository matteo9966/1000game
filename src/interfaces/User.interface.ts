export interface User {
    name:string;
    password:string;
    gameID:string;
    role:'admin'|'user';
    id:string;
    goals:string[];
    proposed:string[];
}