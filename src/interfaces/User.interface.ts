export interface User {
    name:string;
    password:string;
    gameID:string;
    role:'admin'|'user';
    id:string;
    goals:string[];
    proposed:string[];
    tempPassword?:string; // store the temp password here when the admin creates the user
}