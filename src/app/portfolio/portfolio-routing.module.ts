import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from '../about/about.component';
import { AuthGuard } from '../auth/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { MergeListComponent } from './components/tradings/merge-list/merge-list.component';
import { TradeEntryComponent } from './components/tradings/trade-entry/trade-entry.component';

const routes: Routes = [
  {
    path: 'portfolio',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: HomeComponent },
      { path: 'new', component: TradeEntryComponent },
      {
        path: 'edit/:symbol/:key',
        component: TradeEntryComponent,
        data: { edit: true },
      },
      { path: 'merge', component: MergeListComponent },
      { path: 'about', component: AboutComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PortfolioRoutingModule {}
