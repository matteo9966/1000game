export interface SessionTokenPayload{
    gameId:string;
    username:string;
    role:'admin'|'user';
}