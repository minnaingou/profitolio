import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PercentageCalculatorComponent } from './percentage-calculator/percentage-calculator.component';
import { VwapCalculatorComponent } from './vwap-calculator/vwap-calculator.component';

const routes: Routes = [
  {
    path: 'tools',
    children: [
      { path: 'vwap-calculator', component: VwapCalculatorComponent },
      {
        path: 'percentage-calculator',
        component: PercentageCalculatorComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ToolsRoutingModule {}
