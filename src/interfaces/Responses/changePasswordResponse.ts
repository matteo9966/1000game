import { Response } from "./Response";

interface ChangePasswordResponseBody {
    changed:boolean;
}

export type ChangePasswordResponse = Response<ChangePasswordResponseBody>