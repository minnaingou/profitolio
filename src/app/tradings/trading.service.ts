import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Trading } from '../shared/trading.model';

@Injectable({ providedIn: 'root' })
export class TradingService {
  constructor(private http: HttpClient) {}

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
              (symbolTradings, trade) => {
                symbolTradings.push(tradingsResponse[symbol][trade]);
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
}
