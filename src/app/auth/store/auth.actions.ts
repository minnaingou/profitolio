import { Action } from '@ngrx/store';
import { User } from '../models/user.model';

export const LOGIN = '[Auth] Login';
export const SIGN_UP = '[Auth] Sign Up';
export const AUTH_SUCCESS = '[Auth] Auth Success';
export const AUTH_FAIL = '[Auth] Auth Fail';
export const LOGOUT = '[Auth] Logout';
export const AUTO_LOGIN = '[Auth] Auto Login';

export class Login implements Action {
  readonly type = LOGIN;
  constructor(public payload: { email: string; password: string }) {}
}

export class SignUp implements Action {
  readonly type = SIGN_UP;
  constructor(public payload: { email: string; password: string }) {}
}

export class AuthSuccess implements Action {
  readonly type = AUTH_SUCCESS;
  constructor(public payload: User) {}
}

export class AuthFail implements Action {
  readonly type = AUTH_FAIL;
  constructor(public payload: string) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export type AuthActions =
  | Login
  | SignUp
  | AuthSuccess
  | AuthFail
  | Logout
  | AutoLogin;
