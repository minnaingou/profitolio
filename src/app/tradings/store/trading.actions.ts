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
export const AMEND_BUY_TRADE = '[Trading] Amend Buy Trade';
export const EDIT_TRADE = '[Trading] Edit Trade';
export const EDIT_TRADE_SUCCESS = '[Trading] Edit Trade Success';
export const DELETE_TRADE = '[Trading] Delete Trade';
export const DELETE_TRADE_SUCCESS = '[Trading] Delete Trade Success';

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

export class AmendBuyTrade implements Action {
  readonly type = AMEND_BUY_TRADE;
  constructor(public payload: Trading) {}
}

export class EditTrade implements Action {
  readonly type = EDIT_TRADE;
  constructor(public payload: { key: string; trading: Trading }) {}
}

export class EditTradeSuccess implements Action {
  readonly type = EDIT_TRADE_SUCCESS;
  constructor(public payload: { key: string; trading: Trading }) {}
}

export class DeleteTrade implements Action {
  readonly type = DELETE_TRADE;
  constructor(public payload: { key: string; symbol: string }) {}
}

export class DeleteTradeSuccess implements Action {
  readonly type = DELETE_TRADE_SUCCESS;
  constructor(public payload: string) {}
}

export type TradingActions =
  | StoreTrading
  | StoreTradingSuccess
  | FetchTradingsSuccess
  | FetchLatestPrices
  | FetchLatestPricesSuccess
  | FetchCoinListSuccess
  | FetchExchangeListSuccess
  | ClearAll
  | EditTradeSuccess
  | DeleteTradeSuccess;
