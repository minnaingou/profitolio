import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import {
  TOOLBAR_DELETE,
  TOOLBAR_ENTRY_DONE,
  TOOLBAR_FILTER,
  TOOLBAR_MERGE_HELP,
  TOOLBAR_REFRESH
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
  currentpage: string;
  showBackButton: boolean = false;

  get isHomePage() {
    return (
      this.currentpage === '/#Holdings' ||
      this.currentpage === '/#Tradings' ||
      this.currentpage === '/#Overview'
    );
  }

  tradesFilteredSubscription: Subscription;
  tradesFilterClearedSubscription: Subscription;
  tabChangedSubscription: Subscription;

  constructor(private router: Router, private uiService: UiService) {}

  ngOnInit(): void {
    this.uiService.showBackButton.subscribe((showBackButton) => {
      this.showBackButton = showBackButton;
    });
    this.router.events
      .pipe(filter((e) => e instanceof NavigationStart))
      .subscribe((event: NavigationStart) => {
        if (event.url.startsWith('/edit/')) {
          this.currentpage = '/edit';
        } else {
          this.currentpage = event.url;
        }
      });
    this.tabChangedSubscription = this.uiService.tabChanged.subscribe(
      (newTab) => {
        this.currentpage = newTab;
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
    this.tradesFilteredSubscription.unsubscribe();
    this.tradesFilterClearedSubscription.unsubscribe();
    this.tabChangedSubscription.unsubscribe();
  }

  onToolbarAction(action: string) {
    switch (action) {
      case 'ADD':
        this.router.navigate(['/new']);
        break;
      case 'BACK':
        const lastTab = localStorage.getItem('lastTab');
        this.router.navigate(['../'], { fragment: lastTab ? lastTab : '' });
        this.uiService.showBackButton.next(false);
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
