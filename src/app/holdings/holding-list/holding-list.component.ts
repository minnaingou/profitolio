import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { Holding } from 'src/app/shared/holding.model';
import { LatestPrice } from 'src/app/shared/latestPrice.model';
import { Trading } from 'src/app/shared/trading.model';
import * as fromApp from '../../store/app.reducer';
import * as TradingActions from '../../tradings/store/trading.actions';

@Component({
  selector: 'app-holding-list',
  templateUrl: './holding-list.component.html',
  styleUrls: ['./holding-list.component.css'],
})
export class HoldingListComponent implements OnInit, OnDestroy {
  holdingItems: Holding[] = [];
  tradingStoreSubscription: Subscription;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.tradingStoreSubscription = this.store
      .select('trading')
      .pipe(
        map((state) =>
          this.populateHoldings(state.tradings, state.latestPrices)
        )
      )
      .subscribe((holdings) => {
        this.holdingItems = holdings;
      });
  }

  ngOnDestroy(): void {
    this.tradingStoreSubscription.unsubscribe();
  }

  populateHoldings(
    tradings: Trading[],
    latestPrices: LatestPrice[]
  ): Holding[] {
    const symbolTradings = tradings.reduce((categorized, trading) => {
      if (!categorized[trading.symbol]) {
        categorized[trading.symbol] = [];
      }
      categorized[trading.symbol].push(trading);
      return categorized;
    }, {});
    const holdings: Holding[] = Object.keys(symbolTradings).map((symbol) => {
      let totalHolding: number = 0;
      let totalInvested: number = 0;
      symbolTradings[symbol].forEach((tradingItem: Trading) => {
        if (tradingItem.holding) {
          totalHolding += tradingItem.amount;
          totalInvested += tradingItem.amount * tradingItem.price;
        }
      });
      const latestPrice: number = latestPrices
        ? latestPrices.find((price) => price.symbol === symbol)?.price
        : null;
      let realisedPL = 0;
      let totalWorth = null;
      let unrealisedPL = null;
      let perUnrealisedPL = null;
      const unitCost = totalInvested / totalHolding;
      if (latestPrice) {
        totalWorth = latestPrice * totalHolding;
        unrealisedPL = totalWorth - totalInvested;
        perUnrealisedPL = ((latestPrice - unitCost) / unitCost) * 100;
      }
      return new Holding(
        symbol.toLowerCase(),
        totalHolding,
        unitCost,
        totalInvested,
        realisedPL, //TODO later
        latestPrice,
        latestPrice ? totalWorth : null,
        realisedPL + unrealisedPL,
        latestPrice && perUnrealisedPL,
        unrealisedPL
      );
    });

    const symbolList: string[] = holdings.reduce((symbols, holding) => {
      symbols.push(holding.symbol);
      return symbols;
    }, []);

    if (latestPrices.length == 0 && symbolList.length != 0) {
      this.store.dispatch(new TradingActions.FetchLatestPrices());
    }
    return holdings;
  }
}
