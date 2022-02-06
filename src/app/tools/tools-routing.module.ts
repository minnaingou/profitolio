import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VwapCalculatorComponent } from './vwap-calculator/vwap-calculator.component';

const routes: Routes = [
  {
    path: 'tools',
    children: [{ path: 'vwap-calculator', component: VwapCalculatorComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ToolsRoutingModule {}
