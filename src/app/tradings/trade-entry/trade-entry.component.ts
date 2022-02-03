import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import Decimal from 'decimal.js';
import { Subscription } from 'rxjs';
import { Trading } from 'src/app/shared/trading.model';
import {
  PAGE_ADD,
  PAGE_EDIT,
  TOOLBAR_DELETE,
  TOOLBAR_ENTRY_DONE
} from 'src/app/shared/ui-constants';
import { UiService } from 'src/app/shared/ui.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from 'src/app/ui/confirm-dialog/confirm-dialog.component';
import { DialogComponent } from 'src/app/ui/dialog/dialog.component';
import * as fromApp from '../../store/app.reducer';
import * as TradingActions from '../store/trading.actions';
import { TradingService } from '../trading.service';
import { SellingTradeDialogComponent } from './selling-trade-dialog/selling-trade-dialog.component';

@Component({
  selector: 'app-trade-entry',
  templateUrl: './trade-entry.component.html',
  styleUrls: ['./trade-entry.component.css'],
})
export class TradeEntryComponent implements OnInit, OnDestroy {
  entryForm!: FormGroup;
  dateControl = new FormControl(new Date(), Validators.required);
  symbolControl = new FormControl(null, Validators.required);
  exchangeControl = new FormControl(null, Validators.required);
  amountControl = new FormControl(null, Validators.required);
  priceControl = new FormControl(null, Validators.required);
  totalControl = new FormControl({ value: '', disabled: true });

  validForm: boolean = true;
  editMode: boolean = false;
  editingKey: string;

  exchangeList: string[] = [];
  symbolList: string[] = [];

  sellingTrade: Trading;
  sellingTradeNotSelected: boolean;

  toolbarActionSubscription: Subscription;
  tradingStoreSubscription: Subscription;

  constructor(
    formBuilder: FormBuilder,
    private store: Store<fromApp.AppState>,
    private uiService: UiService,
    private tradingService: TradingService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.entryForm = formBuilder.group({
      type: ['buy', Validators.required],
      date: this.dateControl,
      symbol: this.symbolControl,
      exchange: this.exchangeControl,
      amount: this.amountControl,
      price: this.priceControl,
      total: this.totalControl,
    });
  }

  ngOnInit(): void {
    this.editMode = this.route.snapshot.data['edit'];
    if (this.editMode) {
      this.uiService.pageChanged.next(PAGE_EDIT);
    } else {
      this.uiService.pageChanged.next(PAGE_ADD);
    }
    this.toolbarActionSubscription =
      this.uiService.toolbarButtonClicked.subscribe((action) => {
        switch (action) {
          case TOOLBAR_ENTRY_DONE:
            this.onSubmit();
            break;
          case TOOLBAR_DELETE:
            this.onDelete();
            break;
        }
      });
    this.store.dispatch(new TradingActions.FetchEntryAutocomplete());
    this.tradingStoreSubscription = this.store
      .select('trading')
      .subscribe((state) => {
        this.symbolList = state.coinList.map((coin) => coin.toUpperCase());
        this.exchangeList = state.exchangeList.map((exchange) => exchange);
        if (this.editMode) {
          this.populateFormForEdit(state.tradings);
        }
      });
    this.entryForm.valueChanges.subscribe(() => {
      if (this.sellingTrade) this.sellingTrade = null;
    });
  }

  private populateFormForEdit(tradings: Trading[]) {
    const symbol = this.route.snapshot.params['symbol'];
    const key = this.route.snapshot.params['key'];
    this.editingKey = key;
    const editingTrade = tradings
      .filter((trading) => trading.symbol === symbol)
      .find((trading) => trading.key === key);
    if (!editingTrade) {
      this.dialog.open(DialogComponent, {
        data: {
          content: 'No record found.',
          onCloseHandler: () => {
            this.router.navigate(['/'], { fragment: 'tradings' });
          },
        },
      });
    } else {
      this.entryForm.get('type').setValue(editingTrade.type);
      this.entryForm.get('type').disable();
      this.symbolControl.setValue(editingTrade.symbol);
      this.entryForm.controls['symbol'].disable();
      this.exchangeControl.setValue(editingTrade.exchange);
      this.amountControl.setValue(editingTrade.amount);
      this.priceControl.setValue(editingTrade.price);
      this.totalControl.setValue(
        new Decimal(editingTrade.amount).times(new Decimal(editingTrade.price))
      );
    }
  }

  ngOnDestroy(): void {
    this.toolbarActionSubscription.unsubscribe();
    this.tradingStoreSubscription.unsubscribe();
  }

  onSubmit() {
    const tradingEntry = this.entryForm.value;
    if (!this.entryForm.valid) {
      this.dialog.open(DialogComponent, {
        data: { content: 'Entry is not valid.' },
      });
    } else if (tradingEntry.type === 'sell' && !this.sellingTrade) {
      this.sellingTradeNotSelected = true;
      this.dialog.open(DialogComponent, {
        data: { content: 'Please select a selling trade.' },
      });
    } else {
      const symbol: string =
        (tradingEntry.symbol && tradingEntry.symbol) ||
        this.symbolControl.value;
      const type: string =
        tradingEntry.type || this.entryForm.get('type').value;
      const trading: Trading = {
        symbol: symbol.toLowerCase(),
        exchange: tradingEntry.exchange,
        type,
        date: tradingEntry.date,
        updatedDate: tradingEntry.date,
        amount: tradingEntry.amount,
        startingAmount: tradingEntry.amount,
        price: tradingEntry.price,
        holding: true,
      };

      if (this.editMode) {
        this.store.dispatch(
          new TradingActions.EditTrade({ key: this.editingKey, trading })
        );
      } else {
        if (tradingEntry.type === 'sell') {
          trading.sellingInfo = { matchedTrade: this.sellingTrade };
        }
        this.tradingService.createNewTrading(trading);
      }

      this.router.navigate(['/'], { fragment: 'tradings' });
    }
  }

  onDelete() {
    if (!this.editingKey || !this.symbolControl.value) {
      this.dialog.open(DialogComponent, {
        data: { content: 'Cannot delete the record.' },
      });
    } else {
      const dialogData = new ConfirmDialogModel(
        'Confirmation',
        'Are you sure to delete?'
      );
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: '300px',
        data: dialogData,
      });
      dialogRef.afterClosed().subscribe((dialogResult) => {
        if (dialogResult) {
          this.router.navigate(['/'], { fragment: 'tradings' });
          this.store.dispatch(
            new TradingActions.DeleteTrade({
              key: this.editingKey,
              symbol: this.symbolControl.value,
            })
          );
        }
      });
    }
  }

  openSellingDialog() {
    if (!this.entryForm.valid) {
      this.dialog.open(DialogComponent, {
        data: { content: 'Please complete the form first.' },
      });
      return;
    }

    const dialogRef = this.dialog.open(SellingTradeDialogComponent, {
      width: '400px',
      data: {
        symbol: this.symbolControl.value,
        amount: this.amountControl.value,
        price: this.priceControl.value,
      },
    });

    dialogRef.afterClosed().subscribe((selectedTrade) => {
      this.sellingTrade = selectedTrade;
      this.sellingTradeNotSelected = false;
    });
  }
}
