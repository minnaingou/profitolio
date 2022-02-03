import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  PAGE_HOLDINGS,
  TOOLBAR_DELETE,
  TOOLBAR_ENTRY_DONE,
  TOOLBAR_FILTER,
  TOOLBAR_REFRESH,
} from 'src/app/shared/ui-constants';
import { UiService } from 'src/app/shared/ui.service';
import { SortingCriteriaModel } from './sorting-menu/sorting-menu.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit, OnDestroy {
  filterActive: boolean = false;
  currentpage: string = PAGE_HOLDINGS;

  toolbarIconsSubscription: Subscription;
  tradesFilteredSubscription: Subscription;
  tradesFilterClearedSubscription: Subscription;

  constructor(private router: Router, private uiService: UiService) {}

  ngOnInit(): void {
    this.toolbarIconsSubscription = this.uiService.pageChanged.subscribe(
      (pagename) => {
        this.currentpage = pagename;
      }
    );
    this.tradesFilteredSubscription =
      this.uiService.tradeListFiltered.subscribe(() => {
        this.filterActive = true;
      });
    this.tradesFilterClearedSubscription =
      this.uiService.tradeListFilterCleared.subscribe(() => {
        this.filterActive = false;
      });
  }

  ngOnDestroy(): void {
    this.toolbarIconsSubscription.unsubscribe();
    this.tradesFilteredSubscription.unsubscribe();
    this.tradesFilterClearedSubscription.unsubscribe();
  }

  onToolbarAction(action: string) {
    switch (action) {
      case 'ADD':
        this.router.navigate(['/new']);
        break;
      case 'BACK':
        this.router.navigate(['../']);
        break;
      case 'ENTRY_DONE':
        this.uiService.toolbarButtonClicked.next(TOOLBAR_ENTRY_DONE);
        break;
      case 'REFRESH':
        this.uiService.toolbarButtonClicked.next(TOOLBAR_REFRESH);
        break;
      case 'DELETE':
        this.uiService.toolbarButtonClicked.next(TOOLBAR_DELETE);
        break;
      case 'FILTER':
        this.uiService.toolbarButtonClicked.next(TOOLBAR_FILTER);
        break;
    }
  }

  onHoldingSort(criteria: SortingCriteriaModel) {
    this.uiService.holdingSorted.next(criteria);
  }
}
