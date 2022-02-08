import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PercentageCalculatorComponent } from './percentage-calculator/percentage-calculator.component';
import { ToolsRoutingModule } from './tools-routing.module';
import { VwapCalculatorComponent } from './vwap-calculator/vwap-calculator.component';

@NgModule({
  declarations: [VwapCalculatorComponent, PercentageCalculatorComponent],
  imports: [SharedModule, ToolsRoutingModule],
})
export class ToolsModule {}
