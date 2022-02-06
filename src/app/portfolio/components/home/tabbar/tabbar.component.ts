import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-tabbar',
  templateUrl: './tabbar.component.html',
  styleUrls: ['./tabbar.component.css'],
})
export class TabbarComponent implements OnInit {
  @Input() activeIndex: number = 0;
  @Output() tabChanged = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}

  onTabChange(activeIndex: number) {
    this.tabChanged.emit(activeIndex);
  }

  onGotoTradings(tabGroup: MatTabGroup) {
    tabGroup.selectedIndex = 1;
  }
}
