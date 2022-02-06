import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ToolsRoutingModule } from './tools-routing.module';
import { VwapCalculatorComponent } from './vwap-calculator/vwap-calculator.component';
import { PercentageCalculatorComponent } from './percentage-calculator/percentage-calculator.component';


@NgModule({
  declarations: [VwapCalculatorComponent, PercentageCalculatorComponent],
  imports: [
    CommonModule,
    ToolsRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class ToolsModule {}
