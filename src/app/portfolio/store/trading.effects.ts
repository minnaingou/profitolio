import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  catchError,
  concat,
  forkJoin,
  map,
  of,
  switchMap,
  throwError,
  withLatestFrom
} from 'rxjs';
import { UiService } from 'src/app/shared/services/ui.service';
import * as fromApp from '../../store/app.reducer';
import { Trading } from '../models/tradings/trading.model';
import { TradingService } from '../services/trading.service';
import * as TradingActions from '../store/trading.actions';

@Injectable()
export class TradingEffects {
  constructor(
    private actions$: Actions,
    private tradingService: TradingService,
    private uiService: UiService,
    private store: Store<fromApp.AppState>
  ) {}

  storeTrading = createEffect(() => {
    return this.actions$.pipe(
      ofType(TradingActions.STORE_TRADING),
      map((storeTrading: TradingActions.StoreTrading) => storeTrading.payload),
      withLatestFrom(this.store.select('auth')),
      switchMap(([payload, authState]) => {
        return this.tradingService
          .storeTrading(authState.user.userId, payload)
          .pipe(
            map(() => {
              this.uiService.displaySnackbar.next({
                error: false,
                message: 'Record is saved.',
              });
              return new TradingActions.StoreTradingSuccess(payload);
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
      map(() => {
        return new TradingActions.FetchTradings();
      })
    );
  });

  saveAutocompleteData = createEffect(() => {
    return this.actions$.pipe(
      ofType(TradingActions.STORE_TRADING_SUCCESS),
      map(
        (storeTradingSuccess: TradingActions.StoreTradingSuccess) =>
          storeTradingSuccess.payload
      ),
      switchMap((payload) => {
        // saving coin name and exchange name for autocomplete & coin name:id pair for gecko api
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
              )
              // this.tradingService.saveExchangeInfo(payload.exchange).pipe(
              //   map(() => {
              //     return { type: 'DUMMY' };
              //   })
              // )
            );
          })
        );
      })
    );
  });

  fetchTradings = createEffect(() => {
    return this.actions$.pipe(
      ofType(TradingActions.FETCH_TRADINGS),
      withLatestFrom(this.store.select('auth')),
      switchMap(([action, authState]) => {
        return this.tradingService.getTradingList(authState.user.userId);
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
          )
          // this.tradingService.getExistingExchanges().pipe(
          //   map((exchangeList) => {
          //     return new TradingActions.FetchExchangeListSuccess(exchangeList);
          //   })
          // )
        );
      })
    );
  });

  amendBuyTrade = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(TradingActions.AMEND_BUY_TRADE),
        map(
          (amendBuyTrade: TradingActions.AmendBuyTrade) => amendBuyTrade.payload
        ),
        withLatestFrom(this.store.select('auth')),
        switchMap(([payload, authState]) => {
          return this.tradingService.patchTrading(
            authState.user.userId,
            payload.key,
            payload.symbol,
            {
              amount: payload.amount,
              updatedDate: new Date(),
              holding: payload.holding,
            }
          );
        })
      );
    },
    { dispatch: false }
  );

  editTrade = createEffect(() => {
    return this.actions$.pipe(
      ofType(TradingActions.EDIT_TRADE),
      map((editTrade: TradingActions.EditTrade) => editTrade.payload),
      withLatestFrom(this.store.select('auth')),
      switchMap(([payload, authState]) => {
        let trading: Trading = { ...payload.trading };
        return this.tradingService
          .putTrading(
            authState.user.userId,
            payload.key,
            trading.symbol,
            trading
          )
          .pipe(
            map(() => {
              this.uiService.displaySnackbar.next({
                error: false,
                message: 'Record is updated.',
              });
              return new TradingActions.EditTradeSuccess(payload);
            }),
            catchError(() => {
              this.uiService.displaySnackbar.next({
                error: true,
                message: 'Failed to update trade record.',
              });
              return of({ type: 'DUMMY' });
            })
          );
      })
    );
  });

  deleteTrade = createEffect(() => {
    return this.actions$.pipe(
      ofType(TradingActions.DELETE_TRADE),
      map((deleteTrade: TradingActions.DeleteTrade) => deleteTrade.payload),
      withLatestFrom(this.store.select('auth')),
      switchMap(([payload, authState]) => {
        return this.tradingService
          .deleteTrading(authState.user.userId, payload.key, payload.symbol)
          .pipe(
            map(() => {
              return new TradingActions.DeleteTradeSuccess(payload.key);
            }),
            catchError(() => {
              this.uiService.displaySnackbar.next({
                error: true,
                message: 'Failed to delete trade record.',
              });
              return of({ type: 'DUMMY' });
            })
          );
      })
    );
  });

  deleteMultipleTrades = createEffect(() => {
    return this.actions$.pipe(
      ofType(TradingActions.DELETE_MULTIPLE_TRADES),
      map(
        (deleteMultipleTrades: TradingActions.DeleteMultipleTrades) =>
          deleteMultipleTrades.payload
      ),
      withLatestFrom(this.store.select('auth')),
      switchMap(([payload, authState]) => {
        const httpObservableMap: {} = {};
        payload.forEach((item) => {
          httpObservableMap[item.key] = this.tradingService.deleteTrading(
            authState.user.userId,
            item.key,
            item.symbol
          );
        });
        return forkJoin(httpObservableMap);
      }),
      map((keyMap) => {
        const deletedKeys: string[] = Object.keys(keyMap).map((key) => key);
        return new TradingActions.DeleteMultipleTradesSuccess(deletedKeys);
      })
    );
  });

  filterTrades = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(TradingActions.FILTER_TRADES),
        map(() => {
          this.uiService.tradeListFiltered.next();
        })
      );
    },
    { dispatch: false }
  );

  filterTradesCleared = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(TradingActions.FILTER_TRADES_CLEARED),
        map(() => {
          this.uiService.tradeListFilterCleared.next();
        })
      );
    },
    { dispatch: false }
  );
}
