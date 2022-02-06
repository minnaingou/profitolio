import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-tabbar',
  templateUrl: './tabbar.component.html',
  styleUrls: ['./tabbar.component.css'],
})
export class TabbarComponent implements OnInit {
  @Input() activeIndex: number = 0;
  @Output() tabChanged = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  onTabChange(event: MatTabChangeEvent) {
    this.tabChanged.next(event.tab.textLabel);
  }

  onFilterTradings(tabGroup: MatTabGroup) {
    // navigate to tradings tab
    tabGroup.selectedIndex = 1;
  }
}
