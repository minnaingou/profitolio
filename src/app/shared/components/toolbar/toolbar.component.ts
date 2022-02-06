import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  PAGE_HOLDINGS,
  TOOLBAR_DELETE,
  TOOLBAR_ENTRY_DONE,
  TOOLBAR_FILTER,
  TOOLBAR_MERGE_HELP,
  TOOLBAR_REFRESH,
} from 'src/app/shared/ui-constants';
import { UiService } from '../../services/ui.service';
import { SortingCriteriaModel } from './sorting-menu/sorting-menu.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit, OnDestroy {
  @Output() drawerOpened = new EventEmitter<void>();

  filterActive: boolean = false;
  currentpage: string = PAGE_HOLDINGS;

  get isHomePage() {
    return (
      this.currentpage === 'PAGE_TRADINGS' ||
      this.currentpage === 'PAGE_HOLDINGS' ||
      this.currentpage === 'PAGE_OVERVIEW'
    );
  }

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
      case 'MERGE':
        this.router.navigate(['/merge']);
        break;
      case 'MERGE_HELP':
        this.uiService.toolbarButtonClicked.next(TOOLBAR_MERGE_HELP);
        break;
    }
  }

  onHoldingSort(criteria: SortingCriteriaModel) {
    this.uiService.holdingSorted.next(criteria);
  }

  onOpenDrawer() {
    this.drawerOpened.emit();
  }
}
