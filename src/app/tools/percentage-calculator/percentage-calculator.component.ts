import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-percentage-calculator',
  templateUrl: './percentage-calculator.component.html',
  styleUrls: ['./percentage-calculator.component.css'],
})
export class PercentageCalculatorComponent implements OnInit {
  form: FormGroup;
  percentageChanged: number = 0;

  constructor() {}

  ngOnInit(): void {
    this.form = this.getNewFormGroup();
    this.form.valueChanges.subscribe(({ original, target }) => {
      original = original || 0;
      target = target || 0;
      this.percentageChanged = ((target - original) / original) * 100;
    });
  }

  onReset() {
    this.form = this.getNewFormGroup();
    this.percentageChanged = 0;
  }

  getNewFormGroup() {
    return new FormGroup({
      original: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/),
      ]),
      target: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/),
      ]),
    });
  }
}
