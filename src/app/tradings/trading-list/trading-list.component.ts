import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Trading } from 'src/app/shared/trading.model';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-trading-list',
  templateUrl: './trading-list.component.html',
  styleUrls: ['./trading-list.component.css'],
})
export class TradingListComponent implements OnInit, OnDestroy {
  tradingList: Trading[] = [];

  storeSubscription: Subscription;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.storeSubscription = this.store.select('trading').subscribe((state) => {
      if (state.tradings) {
        this.tradingList = [...state.tradings].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();
  }
}
