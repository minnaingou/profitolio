import { LatestPrice } from 'src/app/shared/latestPrice.model';
import { Trading } from 'src/app/shared/trading.model';
import * as TradingActions from './trading.actions';

export interface State {
  tradings: Trading[];
  latestPrices: LatestPrice[];
  coinList: string[];
  exchangeList: string[];
}

const initialState: State = {
  tradings: [],
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
        latestPrices: [],
      };
    case TradingActions.EDIT_TRADE_SUCCESS:
      return {
        ...state,
        tradings: state.tradings.map((trading) =>
          trading.key === action.payload.key
            ? { ...action.payload.trading, key: action.payload.key }
            : trading
        ),
        latestPrices: [],
      };
    case TradingActions.FETCH_TRADINGS_SUCCESS:
      return {
        ...state,
        tradings: action.payload,
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
    case TradingActions.CLEAR_ALL:
      return {
        ...state,
        tradings: [],
        latestPrices: [],
      };
    case TradingActions.DELETE_TRADE_SUCCESS:
      return {
        ...state,
        tradings: state.tradings.filter(
          (trading) => trading.key !== action.payload
        ),
      };
    default:
      return state;
  }
}
