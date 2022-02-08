import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../shared/shared.module';
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
    FilteringSheetComponent,
    OverviewComponent,
    MergeListComponent,
    OverviewItemComponent,
  ],
  imports: [SharedModule, PortfolioRoutingModule, BrowserAnimationsModule],
})
export class PortfolioModule {}
