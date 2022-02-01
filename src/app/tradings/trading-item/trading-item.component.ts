import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Trading } from 'src/app/shared/trading.model';
import { DialogComponent } from 'src/app/ui/dialog/dialog.component';

@Component({
  selector: 'app-trading-item',
  templateUrl: './trading-item.component.html',
  styleUrls: ['./trading-item.component.css'],
})
export class TradingItemComponent implements OnInit {
  @Input() item!: Trading;
  @Output() edit = new EventEmitter<{ symbol: string; key: string }>();

  get isSell() {
    return this.item && this.item.type === 'sell';
  }

  get isBuy() {
    return this.item && this.item.type === 'buy';
  }

  get editable() {
    return (
      this.item && this.isBuy && this.item.amount === this.item.startingAmount
    );
  }

  constructor(private errorDialog: MatDialog) {}

  ngOnInit(): void {}

  onEdit() {
    if (!this.editable) {
      this.errorDialog.open(DialogComponent, {
        data: {
          content: this.isSell
            ? 'Sold items cannot be edited.'
            : 'Traded items cannot be edited.',
        },
      });
    } else {
      this.edit.emit({ symbol: this.item.symbol, key: this.item.key });
    }
  }
}
