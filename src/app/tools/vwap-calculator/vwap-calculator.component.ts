import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs';

@Component({
  selector: 'app-vwap-calculator',
  templateUrl: './vwap-calculator.component.html',
  styleUrls: ['./vwap-calculator.component.css'],
})
export class VwapCalculatorComponent implements OnInit {
  ordersForm: FormGroup;
  totalQuantity: number = 0;
  averagePrice: number = 0;

  get controls() {
    return (this.ordersForm.get('orders') as FormArray).controls;
  }

  constructor() {}

  ngOnInit(): void {
    let orders = new FormArray([this.getNewOrderFormGroup()]);
    this.ordersForm = new FormGroup({
      orders,
    });
    this.ordersForm.valueChanges
      .pipe(map((changes) => changes.orders))
      .subscribe((orders: { quantity: number; price: number }[]) => {
        let totalPrice: number = 0;
        let totalQuantity: number = 0;
        orders.forEach((order) => {
          if (order.quantity && order.price) {
            totalPrice += order.quantity * order.price;
            totalQuantity += order.quantity;
          }
        });
        this.averagePrice = totalPrice / totalQuantity;
        this.totalQuantity = totalQuantity;
      });
  }

  onAdd() {
    (this.ordersForm.get('orders') as FormArray).push(
      this.getNewOrderFormGroup()
    );
  }

  onRemove(index: number) {
    (this.ordersForm.get('orders') as FormArray).removeAt(index);
  }

  onReset() {
    const formArray = this.ordersForm.get('orders') as FormArray;
    formArray.clear();
    formArray.push(this.getNewOrderFormGroup());
    this.averagePrice = 0;
    this.totalQuantity = 0;
  }

  private getNewOrderFormGroup() {
    return new FormGroup({
      quantity: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[0-9.]+[0-9.]*$/),
      ]),
      price: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/),
      ]),
    });
  }
}
