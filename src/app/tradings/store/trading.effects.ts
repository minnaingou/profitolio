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
      map((storeTrading: TradingActions.StoreTrading) => storeTrading.payload),
      switchMap((payload: Trading) => {
        return this.tradingService.storeTrading(payload).pipe(
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
        // saving coin name and exchange name for autocomplete
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

  amendBuyTrade = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(TradingActions.AMEND_BUY_TRADE),
        map(
          (amendBuyTrade: TradingActions.AmendBuyTrade) => amendBuyTrade.payload
        ),
        switchMap((payload: Trading) => {
          return this.tradingService.patchTrading(payload.key, payload.symbol, {
            amount: payload.amount,
            updatedDate: new Date(),
            holding: payload.holding,
          });
        })
      );
    },
    { dispatch: false }
  );

  editTrade = createEffect(() => {
    return this.actions$.pipe(
      ofType(TradingActions.EDIT_TRADE),
      map((editTrade: TradingActions.EditTrade) => editTrade.payload),
      switchMap((payload: { key: string; trading: Trading }) => {
        let trading: Trading = { ...payload.trading };
        return this.tradingService
          .putTrading(payload.key, trading.symbol, trading)
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
      switchMap((payload) => {
        return this.tradingService
          .deleteTrading(payload.key, payload.symbol)
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

  filterTrades = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(TradingActions.FILTER_TRADES),
        map(
          (filterTrades: TradingActions.FilterTrades) => filterTrades.payload
        ),
        map((payload) => {
          this.uiService.tradeListFiltered.next(payload);
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
