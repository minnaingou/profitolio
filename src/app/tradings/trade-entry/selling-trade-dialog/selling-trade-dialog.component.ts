import {
  Component,
  Inject, OnInit,
  ViewEncapsulation
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListOption } from '@angular/material/list';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs';
import { Trading } from 'src/app/shared/trading.model';
import * as fromApp from '../../../store/app.reducer';
import { SellingTradeDialogData } from '../selling-trade-dialog-data.model';

@Component({
  selector: 'app-selling-trade-dialog',
  templateUrl: './selling-trade-dialog.component.html',
  styleUrls: ['./selling-trade-dialog.component.css'],
})
export class SellingTradeDialogComponent implements OnInit {
  sellableTrades: Trading[];

  constructor(
    public dialogRef: MatDialogRef<SellingTradeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SellingTradeDialogData,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.store
      .select('trading')
      .pipe(
        take(1),
        map((state) => state.tradings)
      )
      .subscribe(
        (tradings) =>
          (this.sellableTrades = tradings
            .filter(
              (trading) =>
                trading.holding &&
                trading.symbol === this.data.symbol.toLowerCase() &&
                trading.type === 'buy' &&
                trading.amount >= this.data.amount
            )
            .sort((a, b) => a.amount - b.amount))
      );
  }

  onSelection(selectedTradeRef: MatListOption[]) {
    this.data.sellingTrade = selectedTradeRef[0].value;
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
