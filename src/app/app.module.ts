import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { HoldingItemComponent } from './holdings/holding-item/holding-item.component';
import { HoldingListComponent } from './holdings/holding-list/holding-list.component';
import { HomeComponent } from './home/home.component';
import { TabbarComponent } from './home/tabbar/tabbar.component';
import { TradeEntryComponent } from './tradings/trade-entry/trade-entry.component';
import { TradingItemComponent } from './tradings/trading-item/trading-item.component';
import { TradingListComponent } from './tradings/trading-list/trading-list.component';
import * as fromApp from '../app/store/app.reducer';
import { environment } from 'src/environments/environment';
import { DialogComponent } from './ui/dialog/dialog.component';
import { EffectsModule } from '@ngrx/effects';
import { TradingEffects } from './tradings/store/trading.effects';
import { HttpClientModule } from '@angular/common/http';
import { SellingTradeDialogComponent } from './tradings/trade-entry/selling-trade-dialog/selling-trade-dialog.component';
import { ConfirmDialogComponent } from './ui/confirm-dialog/confirm-dialog.component';
import { SortingMenuComponent } from './toolbar/sorting-menu/sorting-menu.component';
import { FilteringSheetComponent } from './tradings/trading-list/filtering-sheet/filtering-sheet.component';
import { OverviewComponent } from './overview/overview.component';
import { MergeListComponent } from './tradings/merge-list/merge-list.component';
import { OverviewItemComponent } from './overview/overview-item/overview-item.component';
import { DrawerComponent } from './ui/drawer/drawer.component';
import { AboutComponent } from './about/about.component';
import { ToolsModule } from './tools/tools.module';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    TabbarComponent,
    HomeComponent,
    HoldingListComponent,
    HoldingItemComponent,
    TradingListComponent,
    TradingItemComponent,
    TradeEntryComponent,
    DialogComponent,
    SellingTradeDialogComponent,
    ConfirmDialogComponent,
    SortingMenuComponent,
    FilteringSheetComponent,
    OverviewComponent,
    MergeListComponent,
    OverviewItemComponent,
    DrawerComponent,
    AboutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([TradingEffects]),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    HttpClientModule,
    ToolsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatDividerModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDialogModule,
    MatListModule,
    MatMenuModule,
    MatBottomSheetModule,
    MatSlideToggleModule,
    MatBadgeModule,
    MatGridListModule,
    MatProgressBarModule,
    MatSidenavModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
