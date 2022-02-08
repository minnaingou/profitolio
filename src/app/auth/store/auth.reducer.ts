import { User } from '../models/user.model';
import * as AuthActions from '../store/auth.actions';

export interface State {
  user: User;
  error: string;
  loading: boolean;
}

const initialState: State = {
  user: null,
  error: null,
  loading: false,
};

export function authReducer(
  state: State = initialState,
  action: AuthActions.AuthActions
) {
  switch (action.type) {
    case AuthActions.LOGIN:
    case AuthActions.SIGN_UP:
      return {
        ...state,
        error: null,
        loading: true,
      };
    case AuthActions.AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload,
        error: null,
        loading: false,
      };
    case AuthActions.AUTH_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}
