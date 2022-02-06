import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { UiService } from '../../../shared/services/ui.service';
import {
  TOOLBAR_REFRESH
} from '../../../shared/ui-constants';
import * as fromApp from '../../../store/app.reducer';
import * as TradingActions from '../../store/trading.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  tradingStoreSubscription: Subscription;
  snackbarSubscription: Subscription;
  toolbarActionSubscription: Subscription;
  activeTabIndex: number;

  constructor(
    private uiService: UiService,
    private store: Store<fromApp.AppState>,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    // removing frgment passed to set the active tab index
    const pathWithoutHash = this.location.path(false);
    this.location.replaceState(pathWithoutHash);

    this.uiService.tabChanged.next('/#Holdings');
    const fragment = this.route.snapshot.fragment;
    if (fragment && fragment === 'Tradings') {
      this.activeTabIndex = 1;
      this.uiService.tabChanged.next('/#Tradings');
    }
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

  onTabChange(tabLabel: string) {
    this.uiService.tabChanged.next('/#' + tabLabel);
    localStorage.setItem('lastTab', tabLabel);
  }
}
