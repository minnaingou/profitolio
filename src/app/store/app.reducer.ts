import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from '../auth/store/auth.reducer';
import * as fromTrading from '../portfolio/store/trading.reducer';

export interface AppState {
  trading: fromTrading.State;
  auth: fromAuth.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  trading: fromTrading.tradingReducer,
  auth: fromAuth.authReducer,
};
