import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { PAGE_HOME } from '../shared/ui-constants';
import { UiService } from '../shared/ui.service';
import * as fromApp from '../store/app.reducer';
import * as TradingActions from '../tradings/store/trading.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  tradingStoreSubscription: Subscription;

  constructor(
    private uiService: UiService,
    private store: Store<fromApp.AppState>,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.uiService.pageChanged.next(PAGE_HOME);
    this.tradingStoreSubscription = this.store
      .select('trading')
      .subscribe((state) => {
        if (state.saved) {
          this.store.dispatch(new TradingActions.SnackbarDisplayed());
          this._snackBar.open('Trade record saved.', 'OK');
        }
        if (state.error) {
          this.store.dispatch(new TradingActions.SnackbarDisplayed());
          this._snackBar.open('Failed to save trade record.', 'OK');
        }
      });
      this.store.dispatch(new TradingActions.FetchTradings());
  }

  ngOnDestroy(): void {
    this.tradingStoreSubscription.unsubscribe();
  }
}
