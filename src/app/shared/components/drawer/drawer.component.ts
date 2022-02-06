import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.css']
})
export class DrawerComponent implements OnInit {

  @Output() toggleDrawer = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  onToggleDrawer() {
    this.toggleDrawer.next();
  }

}
