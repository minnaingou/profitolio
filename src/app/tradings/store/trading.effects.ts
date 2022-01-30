import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concat, map, of, switchMap, throwError } from 'rxjs';
import { Trading } from 'src/app/shared/trading.model';
import { UiService } from 'src/app/shared/ui.service';
import * as TradingActions from '../store/trading.actions';
import { TradingService } from '../trading.service';

@Injectable()
export class TradingEffects {
  constructor(
    private actions$: Actions,
    private tradingService: TradingService,
    private uiService: UiService
  ) {}

  storeTrading = createEffect(() => {
    return this.actions$.pipe(
      ofType(TradingActions.STORE_TRADING),
      switchMap((storeTrading: TradingActions.StoreTrading) => {
        return this.tradingService.storeTrading(storeTrading.payload).pipe(
          map(() => {
            this.uiService.displaySnackbar.next({
              error: false,
              message: 'Trade record saved.',
            });
            return new TradingActions.StoreTradingSuccess(storeTrading.payload);
          }),
          catchError(() => {
            this.uiService.displaySnackbar.next({
              error: true,
              message: 'Failed to save trade record.',
            });
            return of({ type: 'DUMMY' });
          })
        );
      })
    );
  });

  storeTradingSuccess = createEffect(() => {
    return this.actions$.pipe(
      ofType(TradingActions.STORE_TRADING_SUCCESS),
      map(
        (storeTradingSuccess: TradingActions.StoreTradingSuccess) =>
          storeTradingSuccess.payload
      ),
      switchMap((payload) => {
        return this.tradingService.getCoinList().pipe(
          switchMap((coinListResponse: []) => {
            const coin: any = coinListResponse.find(
              (coin: any) => coin.symbol === payload.symbol.toLowerCase()
            );
            return concat(
              this.tradingService.saveCoinInfo(coin).pipe(
                map(() => {
                  return new TradingActions.FetchLatestPrices();
                })
              ),
              this.tradingService.saveExchangeInfo(payload.exchange).pipe(
                map(() => {
                  return { type: 'DUMMY' };
                })
              )
            );
          })
        );
      })
    );
  });

  fetchTradings = createEffect(() => {
    return this.actions$.pipe(
      ofType(TradingActions.FETCH_TRADINGS),
      switchMap(() => {
        return this.tradingService.getTradingList();
      }),
      map((tradings: Trading[]) => {
        return new TradingActions.FetchTradingsSuccess(tradings);
      })
    );
  });

  fetchLatestPrices = createEffect(() => {
    return this.actions$.pipe(
      ofType(TradingActions.FETCH_LATEST_PRICES),
      switchMap(() => {
        return this.tradingService.getExistingCoins().pipe(
          switchMap((coins) => {
            if (!coins) return throwError(() => new Error('empty coin list'));
            return this.tradingService.getLatestPrices(coins);
          }),
          map((latestPrices) => {
            return new TradingActions.FetchLatestPricesSuccess(latestPrices);
          }),
          catchError(() => {
            return of({ type: 'DUMMY' });
          })
        );
      })
    );
  });

  fetchEntryAutocompleteData = createEffect(() => {
    return this.actions$.pipe(
      ofType(TradingActions.FETCH_ENTRY_AUTOCOMPLETE),
      switchMap(() => {
        return concat(
          this.tradingService.getExistingCoins().pipe(
            map((coins) => {
              let coinList = [];
              if (coins) {
                coinList = Object.keys(coins).map((coin) => coin);
              }
              return new TradingActions.FetchCoinListSuccess(coinList);
            })
          ),
          this.tradingService.getExistingExchanges().pipe(
            map((exchangeList) => {
              return new TradingActions.FetchExchangeListSuccess(exchangeList);
            })
          )
        );
      })
    );
  });
}
