import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Trading } from '../shared/trading.model';
import * as fromApp from '../store/app.reducer';
import * as TradingActions from '../tradings/store/trading.actions';

@Injectable({ providedIn: 'root' })
export class TradingService {
  constructor(
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}

  storeTrading(trading: Trading) {
    return this.http.post<Trading>(
      environment.firebaseUrl + '/tradings/' + trading.symbol + '.json',
      trading
    );
  }

  getCoinList() {
    return this.http.get(
      environment.coingeckoBaseApiUrl + environment.coingeckoCoinList
    );
  }

  saveCoinInfo(coin: any) {
    return this.http.patch(environment.firebaseUrl + '/coins.json', {
      [coin.symbol]: coin,
    });
  }

  saveExchangeInfo(exchange: string) {
    return this.http.patch(environment.firebaseUrl + '/exchanges.json', {
      [exchange]: exchange.toLowerCase(),
    });
  }

  getTradingList() {
    return this.http.get(environment.firebaseUrl + '/tradings.json').pipe(
      map((tradingsResponse) => {
        if (!tradingsResponse) return [];
        const tradings: Trading[] = Object.keys(tradingsResponse).reduce(
          (allTradings, symbol) => {
            const symbolTradings = Object.keys(tradingsResponse[symbol]).reduce(
              (symbolTradings, key) => {
                symbolTradings.push({ ...tradingsResponse[symbol][key], key });
                return symbolTradings;
              },
              []
            );
            allTradings.push(...symbolTradings);
            return allTradings;
          },
          []
        );
        return tradings;
      })
    );
  }

  getExistingCoins() {
    return this.http.get(environment.firebaseUrl + '/coins.json');
  }

  getExistingExchanges() {
    return this.http.get(environment.firebaseUrl + '/exchanges.json').pipe(
      map((exchanges) => {
        if (exchanges) {
          return Object.keys(exchanges).map((exchange) => exchange);
        } else return [];
      })
    );
  }

  getLatestPrices(coins: {}) {
    const coinIds: string[] = Object.keys(coins).map(
      (symbol) => coins[symbol].id
    );
    return this.http
      .get(
        environment.coingeckoBaseApiUrl + environment.coingeckoLatestPrices,
        {
          params: new HttpParams()
            .set('ids', coinIds.join(','))
            .set('vs_currencies', 'usd'),
        }
      )
      .pipe(
        map((latestPriceResponse) => {
          let latestPrices: {
            symbol: string;
            price: number;
          }[];
          latestPrices = Object.keys(latestPriceResponse).map((id) => {
            const symbol = Object.keys(coins).find(
              (symbol) => coins[symbol].id === id
            );
            return {
              symbol,
              price: latestPriceResponse[id].usd,
            };
          });
          return latestPrices;
        })
      );
  }

  createNewTrading(trading: Trading) {
    if (trading.type === 'buy') {
      this.store.dispatch(new TradingActions.StoreTrading(trading));
    } else if (trading.type === 'sell') {
      const matchedTrade = { ...trading.sellingInfo.matchedTrade };
      // amending amount for buy trade and change holding status if necessary
      matchedTrade.amount -= trading.amount;
      if (matchedTrade.amount === 0) matchedTrade.holding = false;
      this.store.dispatch(new TradingActions.AmendBuyTrade(matchedTrade));
      // calculating profit/loss for the new sell trade
      trading.sellingInfo.realisedPL =
        (trading.price - matchedTrade.price) * trading.amount;
      this.store.dispatch(new TradingActions.StoreTrading(trading));
    }
  }

  putTrading(key: string, symbol: string, trading: Trading) {
    return this.http.put(
      environment.firebaseUrl + '/tradings/' + symbol + '/' + key + '.json',
      trading
    );
  }

  deleteTrading(key: string, symbol: string) {
    return this.http.delete(
      environment.firebaseUrl + '/tradings/' + symbol + '/' + key + '.json'
    );
  }

  patchTrading(
    key: string,
    symbol: string,
    trading: { amount: number; updatedDate: Date; holding: boolean }
  ) {
    return this.http.patch(
      environment.firebaseUrl + '/tradings/' + symbol + '/' + key + '.json',
      trading
    );
  }
}
