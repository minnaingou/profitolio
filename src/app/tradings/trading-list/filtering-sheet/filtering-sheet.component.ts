import { Component, Inject, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import * as fromApp from '../../../store/app.reducer';
import * as TradingActions from '../../store/trading.actions';
import { CheckboxModel, FilteringCriteria } from './filtering-criteria.model';

@Component({
  selector: 'app-filtering-sheet',
  templateUrl: './filtering-sheet.component.html',
  styleUrls: ['./filtering-sheet.component.css'],
})
export class FilteringSheetComponent implements OnInit {
  filterForm: FormGroup;
  holdingsOnlyControl = new FormControl(false);

  tradingStoreSubscription: Subscription;

  get symbolControls() {
    return (this.filterForm.get('symbols') as FormArray).controls;
  }

  get exchangeControls() {
    return (this.filterForm.get('exchanges') as FormArray).controls;
  }

  getSelectedFormControl(control: AbstractControl) {
    return control.get('selected') as FormControl;
  }

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<FilteringSheetComponent>,
    private store: Store<fromApp.AppState>,
    private formBuilder: FormBuilder,
    @Inject(MAT_BOTTOM_SHEET_DATA)
    private data: { symbolList: string[]; exchangeList: string[] }
  ) {}

  ngOnInit(): void {
    this.tradingStoreSubscription = this.store
      .select('trading')
      .pipe(map((state) => state.filteringCriteria))
      .subscribe((newCriteria) => {
        this.initForm(newCriteria);
      });
  }

  private initForm(newCriteria: FilteringCriteria) {
    let symbolControls = this.createFormArray(
      this.data.symbolList,
      newCriteria.symbols
    );
    let exchangeControls = this.createFormArray(
      this.data.exchangeList,
      newCriteria.exchanges
    );

    this.filterForm = this.formBuilder.group({
      types: new FormGroup({
        buy: new FormControl(newCriteria.types.find((t) => t.name === 'buy')),
        sell: new FormControl(newCriteria.types.find((t) => t.name === 'sell')),
      }),
      symbols: symbolControls,
      exchanges: exchangeControls,
      holdingsOnly: new FormControl(newCriteria.holdingsOnly),
      fromDate: new FormControl(newCriteria.fromDate),
      toDate: new FormControl(newCriteria.toDate),
      minAmount: new FormControl(newCriteria.minAmount),
      maxAmount: new FormControl(newCriteria.maxAmount),
    });
  }

  private createFormArray(
    originalList: string[],
    criteriaList: CheckboxModel[]
  ) {
    let formArrayControls = new FormArray([]);
    originalList.forEach((item) => {
      if (criteriaList.length === 0) {
        formArrayControls.push(
          new FormGroup({
            name: new FormControl(item),
            selected: new FormControl(false),
          })
        );
      } else {
        formArrayControls.push(
          new FormGroup({
            name: new FormControl(item),
            selected: new FormControl(
              criteriaList.find((s) => s.name === item)
            ),
          })
        );
      }
    });
    return formArrayControls;
  }

  onReset() {
    this.store.dispatch(new TradingActions.FilterTradesCleared());
    this._bottomSheetRef.dismiss();
  }

  onFilter() {
    const criteria: FilteringCriteria = this.filterForm.value;
    if (!this.filterForm.pristine) {
      const newCriteria = {
        types: Object.keys(criteria['types'])
          .filter((type) => criteria['types'][type])
          .map((type) => ({ name: type, selected: true })),
        holdingsOnly: criteria.holdingsOnly,
        symbols: criteria['symbols'].filter((c: CheckboxModel) => c.selected),
        exchanges: criteria['exchanges'].filter(
          (c: CheckboxModel) => c.selected
        ),
        fromDate: criteria.fromDate,
        toDate: criteria.toDate,
        minAmount: criteria.minAmount,
        maxAmount: criteria.maxAmount,
      };
      this.store.dispatch(new TradingActions.FilterTrades(newCriteria));
    }
    this._bottomSheetRef.dismiss();
  }
}
