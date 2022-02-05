import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { SortingCriteriaModel } from 'src/app/toolbar/sorting-menu/sorting-menu.component';
import { Holding } from 'src/app/shared/holding.model';
import { LatestPrice } from 'src/app/shared/latestPrice.model';
import { Trading } from 'src/app/shared/trading.model';
import { UiService } from 'src/app/shared/ui.service';
import { FilteringCriteria } from 'src/app/tradings/trading-list/filtering-sheet/filtering-criteria.model';
import * as fromApp from '../../store/app.reducer';
import * as TradingActions from '../../tradings/store/trading.actions';

@Component({
  selector: 'app-holding-list',
  templateUrl: './holding-list.component.html',
  styleUrls: ['./holding-list.component.css'],
})
export class HoldingListComponent implements OnInit, OnDestroy {
  @Output() gotoTradings = new EventEmitter<void>();

  holdingItems: Holding[] = [];

  tradingStoreSubscription: Subscription;
  holdingSortedSubscription: Subscription;

  constructor(
    private uiService: UiService,
    private store: Store<fromApp.AppState>
  ) {}

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

    this.holdingSortedSubscription = this.uiService.holdingSorted.subscribe(
      (criteria: SortingCriteriaModel) => {
        this.holdingItems.sort((a, b) => this.sortHoldings(criteria, a, b));
      }
    );
  }

  ngOnDestroy(): void {
    this.tradingStoreSubscription.unsubscribe();
    this.holdingSortedSubscription.unsubscribe();
  }

  onFilter(symbolName: string) {
    const newCriteria: FilteringCriteria = {
      types: [
        { name: 'buy', selected: true },
        { name: 'sell', selected: true },
      ],
      holdingsOnly: true,
      symbols: [{ name: symbolName, selected: true }],
    };
    this.store.dispatch(new TradingActions.FilterTrades(newCriteria));
    this.gotoTradings.emit();
  }

  private sortHoldings(criteria: SortingCriteriaModel, a: any, b: any) {
    if (criteria.order === 'asc') {
      return criteria.isNumber
        ? a[criteria.orderBy] - b[criteria.orderBy]
        : a[criteria.orderBy].localeCompare(b[criteria.orderBy]);
    } else {
      return criteria.isNumber
        ? b[criteria.orderBy] - a[criteria.orderBy]
        : b[criteria.orderBy].localeCompare(a[criteria.orderBy]);
    }
  }

  private populateHoldings(
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
      let realisedPL = 0;
      let totalWorth = null;
      let unrealisedPL = null;
      let perUnrealisedPL = null;

      symbolTradings[symbol].forEach((tradingItem: Trading) => {
        if (tradingItem.holding && tradingItem.type === 'buy') {
          totalHolding += tradingItem.amount;
          totalInvested += tradingItem.amount * tradingItem.price;
        } else if (tradingItem.type === 'sell') {
          realisedPL += tradingItem.sellingInfo.realisedPL;
        }
      });
      const latestPrice: number = latestPrices
        ? latestPrices.find((price) => price.symbol === symbol)?.price
        : null;
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
        realisedPL,
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
    return holdings
      .filter((holdingItem) => holdingItem.holding !== 0)
      .sort((a, b) => b.totalCost - a.totalCost);
  }
}
