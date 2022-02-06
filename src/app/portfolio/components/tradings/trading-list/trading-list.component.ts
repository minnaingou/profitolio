import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { FilteringCriteria } from 'src/app/portfolio/models/tradings/filtering-criteria.model';
import { Trading } from 'src/app/portfolio/models/tradings/trading.model';
import { UiService } from 'src/app/shared/services/ui.service';
import { TOOLBAR_FILTER } from 'src/app/shared/ui-constants';
import * as fromApp from '../../../../store/app.reducer';
import { FilteringSheetComponent } from './filtering-sheet/filtering-sheet.component';

@Component({
  selector: 'app-trading-list',
  templateUrl: './trading-list.component.html',
  styleUrls: ['./trading-list.component.css'],
})
export class TradingListComponent implements OnInit, OnDestroy {
  tradingList: Trading[] = [];
  filteredTradingList: Trading[] = [];

  tradingStoreSubscription: Subscription;
  toolbarActionSubscription: Subscription;

  constructor(
    private uiService: UiService,
    private router: Router,
    private _bottomSheet: MatBottomSheet,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.tradingStoreSubscription = this.store
      .select('trading')
      .subscribe((state) => {
        if (state.tradings) {
          this.tradingList = state.tradings;
          this.filteredTradingList = this.filterByCriteria(
            state.tradings,
            state.filteringCriteria
          ).sort(this.sortByDate);
        }
      });

    this.toolbarActionSubscription =
      this.uiService.toolbarButtonClicked.subscribe((action) => {
        if (action === TOOLBAR_FILTER) {
          this.openFilterSheet();
        }
      });
  }

  ngOnDestroy(): void {
    this.tradingStoreSubscription.unsubscribe();
    this.toolbarActionSubscription.unsubscribe();
  }

  onEdit(data: { symbol: string; key: string }) {
    this.router.navigate(['/edit', data.symbol, data.key]);
  }

  openFilterSheet(): void {
    // const symbolList = new Set();
    // const exchangeList = new Set();
    // this.tradingList.forEach((trading) => {
    //   symbolList.add(trading.symbol);
    //   trading.exchange && exchangeList.add(trading.exchange);
    // });
    // this._bottomSheet.open(FilteringSheetComponent, {
    //   data: { symbolList, exchangeList },
    // });
    this._bottomSheet.open(FilteringSheetComponent);
  }

  private filterByCriteria(
    tradingList: Trading[],
    criteria: FilteringCriteria
  ) {
    return tradingList
      .filter((trading) => {
        // filtering for 'show only holdings'
        return criteria.holdingsOnly ? trading.holding : true;
      })
      .filter((trading) => {
        // filtering for 'type'
        if (criteria.types && criteria.types.length !== 0) {
          for (let type of criteria.types) {
            if (type.name === trading.type) return true;
          }
          return false;
        }
        return true;
      })
      .filter((trading) => {
        // filtering for 'symbol'
        if (criteria.symbols && criteria.symbols.length !== 0) {
          for (let symbol of criteria.symbols) {
            if (symbol.name === trading.symbol) return true;
          }
          return false;
        }
        return true;
      })
      .filter((trading) => {
        // filtering for 'exchange'
        if (criteria.exchanges && criteria.exchanges.length !== 0) {
          for (let exchange of criteria.exchanges) {
            if (exchange.name === trading.exchange) return true;
          }
          return false;
        }
        return true;
      })
      .filter((trading) => {
        // filtering for date range
        // skip if no date range is set
        if (!criteria.fromDate && !criteria.toDate) return true;

        const tradingDate = new Date(trading.date);
        const fromDate = criteria.fromDate || new Date('January 01, 1990');
        let toDate: Date = criteria.toDate || new Date();
        toDate.setHours(23);
        toDate.setMinutes(59);
        toDate.setSeconds(59);
        return tradingDate >= fromDate && tradingDate <= toDate;
      })
      .filter((trading) => {
        // filtering for min - max amount
        // skip if no amount range is set
        if (!criteria.minAmount && !criteria.maxAmount) return true;

        const minAmount = criteria.minAmount || 0;
        if (criteria.maxAmount) {
          return (
            trading.amount >= minAmount && trading.amount <= criteria.maxAmount
          );
        } else if (!criteria.maxAmount) {
          return trading.amount >= minAmount;
        }
        return true;
      });
  }

  private sortByDate(a: Trading, b: Trading) {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }
}
