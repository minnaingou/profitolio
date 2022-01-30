import { Component, Input, OnInit } from '@angular/core';
import { Trading } from 'src/app/shared/trading.model';

@Component({
  selector: 'app-trading-item',
  templateUrl: './trading-item.component.html',
  styleUrls: ['./trading-item.component.css']
})
export class TradingItemComponent implements OnInit {

  @Input() item!: Trading;

  constructor() { }

  ngOnInit(): void {
  }

}
