import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import Decimal from 'decimal.js';
import { map, Subscription } from 'rxjs';
import { Trading } from 'src/app/portfolio/models/tradings/trading.model';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { UiService } from 'src/app/shared/services/ui.service';
import { TOOLBAR_MERGE_HELP } from 'src/app/shared/ui-constants';
import * as fromApp from '../../../../store/app.reducer';
import * as TradingActions from '../../../store/trading.actions';


@Component({
  selector: 'app-merge-list',
  templateUrl: './merge-list.component.html',
  styleUrls: ['./merge-list.component.css'],
})
export class MergeListComponent implements OnInit, OnDestroy {
  selectedSymbol: string;
  eligibleSymbols: string[];
  preview: Trading;
  eligibleTradings: Trading[];
  eligibleSymbolTradings: Trading[];
  mergable: boolean = false;

  tradingStoreSubscription: Subscription;
  toolbarActionSubscription: Subscription;

  constructor(
    private uiService: UiService,
    private dialog: MatDialog,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.uiService.showBackButton.next(true);

    this.tradingStoreSubscription = this.store
      .select('trading')
      .pipe(map((state) => state.tradings))
      .subscribe((tradings) => {
        if (tradings.length === 0) {
          this.store.dispatch(new TradingActions.FetchTradings());
        } else {
          this.eligibleTradings = this.filterEligibleTradings(tradings);
          this.eligibleSymbolTradings = this.filterBySelectedSymbol();

          // preparing preview item
          this.preview = this.getDefaultPreview();
        }
      });

    this.toolbarActionSubscription = this.uiService.toolbarButtonClicked.subscribe((action) => {
      switch (action) {
        case TOOLBAR_MERGE_HELP:
          this.dialog.open(DialogComponent, {
            data: {
              title: 'About Merging',
              content:
                'Multiple records with small amount can be merged together to make up' +
                ' a one big trade item so that it will be listed in the sell menu when you' +
                ' create a new selling trade. This action will remove the old trade items' +
                ' to create a new one and the information such as exchange, trading date' +
                ' and the original amount will not be retained. You cannot undo the merging.',
              closeLabel: 'I understand',
            },
          });
          break;
      }
    });
  }

  ngOnDestroy(): void {
    this.tradingStoreSubscription.unsubscribe();
    this.toolbarActionSubscription.unsubscribe();
  }

  onSymbolChange() {
    this.eligibleSymbolTradings = this.filterBySelectedSymbol();
    this.preview = this.getDefaultPreview();
  }

  calculatePreview(selectionList: MatSelectionList) {
    let totalAmount: number = 0;
    let totalCost: Decimal = new Decimal(0);
    const selectedList = selectionList.selectedOptions.selected;
    if (selectedList.length > 0) {
      this.mergable = selectedList.length > 1;
      selectedList.forEach((selection) => {
        totalAmount += selection.value['amount'];
        totalCost = totalCost.plus(
          new Decimal(selection.value['amount']).times(selection.value['price'])
        );
      });
      this.preview = {
        symbol: this.selectedSymbol,
        amount: totalAmount,
        startingAmount: totalAmount,
        price: +Decimal.div(totalCost, totalAmount).toPrecision(4),
        date: new Date(),
        updatedDate: new Date(),
        type: 'buy',
        holding: true,
        merged: true,
        exchange: '',
      };
    } else {
      this.mergable = false;
      this.preview = this.getDefaultPreview();
    }
  }

  onMerge(selectedItems: MatListOption[]) {
    const dialogData = new ConfirmDialogModel(
      'Confirmation',
      'Selected items will be merged permanently. Are you sure to continue?'
    );
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '300px',
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        let finalAmount = 0;
        let totalCost: Decimal = new Decimal(0);
        const deleteList: { key: string; symbol: string }[] = [];
        selectedItems
          .map((item) => item.value)
          .forEach((trading: Trading) => {
            deleteList.push({ key: trading.key, symbol: trading.symbol });
            finalAmount += trading.amount;
            totalCost = totalCost.plus(
              new Decimal(trading.amount).times(trading.price)
            );
          });
        const mergedTrade: Trading = {
          symbol: this.selectedSymbol,
          date: new Date(),
          updatedDate: new Date(),
          type: 'buy',
          holding: true,
          exchange: '',
          merged: true,
          amount: finalAmount,
          startingAmount: finalAmount,
          price: +Decimal.div(totalCost, finalAmount).toPrecision(4),
        };
        this.store.dispatch(new TradingActions.StoreTrading(mergedTrade));
        this.store.dispatch(
          new TradingActions.DeleteMultipleTrades(deleteList)
        );
        this.router.navigate(['/'], { fragment: 'Tradings' });
      }
    });
  }

  private filterBySelectedSymbol() {
    return this.eligibleTradings.filter((trading) => {
      return trading.symbol === this.selectedSymbol;
    });
  }

  private filterEligibleTradings(tradings: Trading[]) {
    const eligibleTradings = tradings.filter((trading) => {
      return trading.type === 'buy' && trading.holding;
    });
    const eligibleSymbolList = new Set<string>();
    tradings.forEach((trading) => {
      eligibleSymbolList.add(trading.symbol);
    });
    if (eligibleSymbolList.size > 0) {
      this.eligibleSymbols = Array.from(eligibleSymbolList).sort((a, b) =>
        a.localeCompare(b)
      );
      this.selectedSymbol = this.eligibleSymbols[0];
    }
    return eligibleTradings;
  }

  private getDefaultPreview() {
    return {
      symbol: this.selectedSymbol,
      amount: 0,
      date: new Date(),
      exchange: '',
      holding: true,
      price: 0,
      startingAmount: 0,
      type: 'buy',
      updatedDate: new Date(),
      merged: true,
    };
  }
}
