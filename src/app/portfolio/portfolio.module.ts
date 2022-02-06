import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { HoldingItemComponent } from './components/holdings/holding-item/holding-item.component';
import { HoldingListComponent } from './components/holdings/holding-list/holding-list.component';
import { HomeComponent } from './components/home/home.component';
import { TabbarComponent } from './components/home/tabbar/tabbar.component';
import { OverviewItemComponent } from './components/overview/overview-item/overview-item.component';
import { OverviewComponent } from './components/overview/overview.component';
import { MergeListComponent } from './components/tradings/merge-list/merge-list.component';
import { SellingTradeDialogComponent } from './components/tradings/trade-entry/selling-trade-dialog/selling-trade-dialog.component';
import { TradeEntryComponent } from './components/tradings/trade-entry/trade-entry.component';
import { TradingItemComponent } from './components/tradings/trading-item/trading-item.component';
import { FilteringSheetComponent } from './components/tradings/trading-list/filtering-sheet/filtering-sheet.component';
import { TradingListComponent } from './components/tradings/trading-list/trading-list.component';
import { PortfolioRoutingModule } from './portfolio-routing.module';

@NgModule({
  declarations: [
    TabbarComponent,
    HomeComponent,
    HoldingListComponent,
    HoldingItemComponent,
    TradingListComponent,
    TradingItemComponent,
    TradeEntryComponent,
    SellingTradeDialogComponent,
    ConfirmDialogComponent,
    FilteringSheetComponent,
    OverviewComponent,
    MergeListComponent,
    OverviewItemComponent,
  ],
  imports: [
    CommonModule,
    PortfolioRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDialogModule,
    MatBottomSheetModule,
    MatListModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatDividerModule,
  ],
})
export class PortfolioModule {}
