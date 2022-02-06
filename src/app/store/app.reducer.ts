import { ActionReducerMap } from "@ngrx/store";
import * as fromTrading from "../portfolio/store/trading.reducer";

export interface AppState {
  trading: fromTrading.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  trading: fromTrading.tradingReducer,
}