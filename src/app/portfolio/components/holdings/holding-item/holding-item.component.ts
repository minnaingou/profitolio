import { Component, Input, OnInit } from '@angular/core';

import { Holding } from 'src/app/portfolio/models/holding/holding.model';

@Component({
  selector: 'app-holding-item',
  templateUrl: './holding-item.component.html',
  styleUrls: ['./holding-item.component.css']
})
export class HoldingItemComponent implements OnInit {

  @Input() item!: Holding;

  constructor() { }

  ngOnInit(): void {
  }

}
