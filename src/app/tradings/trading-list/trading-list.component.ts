import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, take } from 'rxjs';

import { Trading } from 'src/app/shared/trading.model';
import { UiService } from 'src/app/shared/ui.service';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-trading-list',
  templateUrl: './trading-list.component.html',
  styleUrls: ['./trading-list.component.css'],
})
export class TradingListComponent implements OnInit {
  tradingList: Trading[] = [];

  constructor(private router: Router, private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.store
      .select('trading')
      .pipe(take(1))
      .subscribe((state) => {
        if (state.tradings) {
          this.tradingList = [...state.tradings].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
        }
      });
  }

  onEdit(data: { symbol: string; key: string }) {
    this.router.navigate(['/edit', data.symbol, data.key]);
  }
}
