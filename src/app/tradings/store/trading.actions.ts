import { Action } from '@ngrx/store';
import { Trading } from 'src/app/shared/trading.model';

export const STORE_TRADING = '[Trading] Store Trading';
export const STORE_TRADING_SUCCESS = '[Trading] Store Trading Success';
export const FETCH_TRADINGS = '[Trading] Fetch Tradings';
export const FETCH_TRADINGS_SUCCESS = '[Trading] Fetch Tradings Success';
export const FETCH_LATEST_PRICES = '[Trading] Fetch Latest Prices';
export const FETCH_LATEST_PRICES_SUCCESS =
  '[Trading] Fetch Latest Prices Success';
export const FETCH_ENTRY_AUTOCOMPLETE = '[Trading] Fetch Coin List';
export const FETCH_COIN_LIST_SUCCESS = '[Trading] Fetch Coin List Success';
export const FETCH_EXCHANGE_LIST_SUCCESS =
  '[Trading] Fetch Exchange List Success';
export const CLEAR_ALL = '[Trading] Clear All';

export class StoreTrading implements Action {
  readonly type = STORE_TRADING;
  constructor(public payload: Trading) {}
}

export class StoreTradingSuccess implements Action {
  readonly type = STORE_TRADING_SUCCESS;
  constructor(public payload: Trading) {}
}

export class FetchTradings implements Action {
  readonly type = FETCH_TRADINGS;
}

export class FetchTradingsSuccess implements Action {
  readonly type = FETCH_TRADINGS_SUCCESS;
  constructor(public payload: Trading[]) {}
}

export class FetchLatestPrices implements Action {
  readonly type = FETCH_LATEST_PRICES;
}

export class FetchLatestPricesSuccess implements Action {
  readonly type = FETCH_LATEST_PRICES_SUCCESS;
  constructor(public payload: { symbol: string; price: number }[]) {}
}

export class FetchEntryAutocomplete implements Action {
  readonly type = FETCH_ENTRY_AUTOCOMPLETE;
}

export class FetchCoinListSuccess implements Action {
  readonly type = FETCH_COIN_LIST_SUCCESS;
  constructor(public payload: string[]) {}
}

export class FetchExchangeListSuccess implements Action {
  readonly type = FETCH_EXCHANGE_LIST_SUCCESS;
  constructor(public payload: string[]) {}
}

export class ClearAll implements Action {
  readonly type = CLEAR_ALL;
}

export type TradingActions =
  | StoreTrading
  | StoreTradingSuccess
  | FetchTradingsSuccess
  | FetchLatestPrices
  | FetchLatestPricesSuccess
  | FetchCoinListSuccess
  | FetchExchangeListSuccess
  | ClearAll;
