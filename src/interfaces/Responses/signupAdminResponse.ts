import { Game } from "../Game.interface";
import { Response } from "./Response";

interface SignupAdminBody {
    success:true
}

export type SignupAdminResponse = Response<SignupAdminBody>;