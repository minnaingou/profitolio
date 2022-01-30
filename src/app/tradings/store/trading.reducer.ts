import { LatestPrice } from 'src/app/shared/latestPrice.model';
import { Trading } from 'src/app/shared/trading.model';
import * as TradingActions from './trading.actions';

export interface State {
  tradings: Trading[];
  saved: boolean;
  error: Error;
  latestPrices: LatestPrice[];
  coinList: string[];
  exchangeList: string[];
}

const initialState: State = {
  tradings: [],
  saved: false,
  error: null,
  latestPrices: [],
  coinList: [],
  exchangeList: [],
};

export function tradingReducer(
  state: State = initialState,
  action: TradingActions.TradingActions
): State {
  switch (action.type) {
    case TradingActions.STORE_TRADING_SUCCESS:
      return {
        ...state,
        saved: true,
        tradings: [...state.tradings, action.payload],
        latestPrices: [],
      };
    case TradingActions.DISPLAY_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case TradingActions.FETCH_TRADINGS_SUCCESS:
      return {
        ...state,
        tradings: action.payload,
      };
    case TradingActions.SNACKBAR_DISPLAYED:
      return {
        ...state,
        saved: false,
        error: null,
      };
    case TradingActions.FETCH_LATEST_PRICES_SUCCESS:
      return {
        ...state,
        latestPrices: action.payload,
      };
    case TradingActions.FETCH_COIN_LIST_SUCCESS:
      return {
        ...state,
        coinList: action.payload,
      };
    case TradingActions.FETCH_EXCHANGE_LIST_SUCCESS:
      return {
        ...state,
        exchangeList: action.payload,
      };
    default:
      return state;
  }
}
