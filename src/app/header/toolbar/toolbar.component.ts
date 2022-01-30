import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  PAGE_HOME,
  TOOLBAR_ADD_DONE,
  TOOLBAR_REFRESH,
} from 'src/app/shared/ui-constants';
import { UiService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit, OnDestroy {
  toolbarIconsSubscription!: Subscription;
  currentpage: string = PAGE_HOME;

  constructor(private router: Router, private uiService: UiService) {}

  ngOnInit(): void {
    this.toolbarIconsSubscription = this.uiService.pageChanged.subscribe(
      (pagename) => {
        this.currentpage = pagename;
      }
    );
  }

  ngOnDestroy(): void {
    this.toolbarIconsSubscription.unsubscribe();
  }

  onToolbarAction(action: string) {
    switch (action) {
      case 'ADD':
        this.router.navigate(['/new']);
        break;
      case 'BACK':
        this.router.navigate(['../']);
        break;
      case 'ADD_DONE':
        this.uiService.toolbarButtonClicked.next(TOOLBAR_ADD_DONE);
        break;
      case 'REFRESH':
        this.uiService.toolbarButtonClicked.next(TOOLBAR_REFRESH);
        break;
    }
  }
}
