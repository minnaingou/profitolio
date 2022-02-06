import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToolsRoutingModule } from './tools-routing.module';
import { VwapCalculatorComponent } from './vwap-calculator/vwap-calculator.component';


@NgModule({
  declarations: [
    VwapCalculatorComponent
  ],
  imports: [
    CommonModule,
    ToolsRoutingModule
  ]
})
export class ToolsModule { }
