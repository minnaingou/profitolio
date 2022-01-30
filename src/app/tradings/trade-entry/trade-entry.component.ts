import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { Trading } from 'src/app/shared/trading.model';
import { PAGE_ADD, TOOLBAR_ADD_DONE } from 'src/app/shared/ui-constants';
import { UiService } from 'src/app/shared/ui.service';
import { DialogComponent } from 'src/app/ui/dialog/dialog.component';
import * as fromApp from '../../store/app.reducer';
import * as TradingActions from '../store/trading.actions';

@Component({
  selector: 'app-trade-entry',
  templateUrl: './trade-entry.component.html',
  styleUrls: ['./trade-entry.component.css'],
})
export class TradeEntryComponent implements OnInit, OnDestroy {
  entryForm!: FormGroup;
  typeControl = new FormControl('buy', Validators.required);
  dateControl = new FormControl(new Date(), Validators.required);
  symbolControl = new FormControl(null, Validators.required);
  exchangeControl = new FormControl(null, Validators.required);
  amountControl = new FormControl(null, Validators.required);
  priceControl = new FormControl(null, Validators.required);
  totalControl = new FormControl({ value: '', disabled: true });

  validForm: boolean = true;

  exchangeList: string[] = ['Binance', 'OKEx'];
  //symbolList: string[] = ['ETH', 'ADA', 'BNB'];
  symbolList: string[] = [];

  toolbarActionSubscription: Subscription;
  tradingStoreSubscription: Subscription;

  constructor(
    formBuilder: FormBuilder,
    private router: Router,
    private store: Store<fromApp.AppState>,
    private uiService: UiService,
    private dialog: MatDialog
  ) {
    this.entryForm = formBuilder.group({
      type: this.typeControl,
      date: this.dateControl,
      symbol: this.symbolControl,
      exchange: this.exchangeControl,
      amount: this.amountControl,
      price: this.priceControl,
      total: this.totalControl,
    });
  }

  ngOnInit(): void {
    this.uiService.pageChanged.next(PAGE_ADD);
    this.toolbarActionSubscription =
      this.uiService.toolbarButtonClicked.subscribe((action) => {
        switch (action) {
          case TOOLBAR_ADD_DONE:
            this.onSubmit();
        }
      });
    this.store.dispatch(new TradingActions.FetchEntryAutocomplete());
    this.tradingStoreSubscription = this.store
      .select('trading')
      .subscribe((state) => {
        this.symbolList = state.coinList.map((coin) => coin.toUpperCase());
        this.exchangeList = state.exchangeList.map((exchange) => exchange);
      });
  }

  ngOnDestroy(): void {
    this.toolbarActionSubscription.unsubscribe();
    this.tradingStoreSubscription.unsubscribe();
  }

  onSubmit() {
    if (!this.entryForm.valid) {
      this.dialog.open(DialogComponent, {
        data: { content: 'Entry is not valid.' },
      });
    } else {
      const tradingEntry = this.entryForm.value;
      const trading: Trading = {
        symbol: tradingEntry.symbol.toLowerCase(),
        exchange: tradingEntry.exchange,
        type: tradingEntry.type,
        date: tradingEntry.date,
        amount: tradingEntry.amount,
        price: tradingEntry.price,
        holding: true,
      };
      this.store.dispatch(new TradingActions.StoreTrading(trading));
      this.router.navigate(['/']); // TODO go to trade list
    }
  }
}
