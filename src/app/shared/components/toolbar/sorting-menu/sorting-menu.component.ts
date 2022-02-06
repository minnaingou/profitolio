import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sorting-menu',
  templateUrl: './sorting-menu.component.html',
})
export class SortingMenuComponent implements OnInit {
  LOW_TO_HIGH = 'Low to High';
  HIGH_TO_LOW = 'High to Low';

  @Output() sorted = new EventEmitter<SortingCriteriaModel>();

  constructor() {}

  ngOnInit(): void {}

  onSort(orderBy: string, order: string, isNumber: boolean) {
    this.sorted.emit(new SortingCriteriaModel(orderBy, order, isNumber));
  }
}

export class SortingCriteriaModel {
  constructor(
    public orderBy: string,
    public order: string,
    public isNumber: boolean
  ) {}
}
