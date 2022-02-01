import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { PAGE_HOME, TOOLBAR_REFRESH } from '../shared/ui-constants';
import { UiService } from '../shared/ui.service';
import * as fromApp from '../store/app.reducer';
import * as TradingActions from '../tradings/store/trading.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  tradingStoreSubscription: Subscription;
  snackbarSubscription: Subscription;
  toolbarActionSubscription: Subscription;

  constructor(
    private uiService: UiService,
    private store: Store<fromApp.AppState>,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.uiService.pageChanged.next(PAGE_HOME);
    this.snackbarSubscription = this.uiService.displaySnackbar.subscribe(
      (payload: { error: boolean; message: string }) => {
        this._snackBar.open(payload.message, 'OK', { duration: 2 * 1000 });
      }
    );
    this.store.dispatch(new TradingActions.FetchTradings());
    this.toolbarActionSubscription =
      this.uiService.toolbarButtonClicked.subscribe((action) => {
        if (action === TOOLBAR_REFRESH) {
          this.store.dispatch(new TradingActions.ClearAll());
          this.store.dispatch(new TradingActions.FetchTradings());
        }
      });
  }

  ngOnDestroy(): void {
    this.snackbarSubscription.unsubscribe();
    this.toolbarActionSubscription.unsubscribe();
  }
}
