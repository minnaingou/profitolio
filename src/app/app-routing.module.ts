import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TradeEntryComponent } from './tradings/trade-entry/trade-entry.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'new', component: TradeEntryComponent },
  {
    path: 'edit/:symbol/:key',
    component: TradeEntryComponent,
    data: { edit: true },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
