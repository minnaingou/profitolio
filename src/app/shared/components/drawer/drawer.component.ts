import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import * as fromApp from '../../../store/app.reducer';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.css'],
})
export class DrawerComponent implements OnInit {
  @Output() toggleDrawer = new EventEmitter<void>();

  loggedIn: boolean = false;
  loggedInEmail: string;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.store
      .select('auth')
      .pipe(map((state) => state.user))
      .subscribe((user) => {
        if (user) {
          this.loggedIn = true;
          this.loggedInEmail = user.email;
        } else {
          this.loggedIn = false;
          this.loggedInEmail = null;
        }
      });
  }

  onToggleDrawer() {
    this.toggleDrawer.next();
  }
}
