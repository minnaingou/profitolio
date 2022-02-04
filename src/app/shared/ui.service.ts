import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SortingCriteriaModel } from '../header/toolbar/sorting-menu/sorting-menu.component';
import { FilteringCriteria } from '../tradings/trading-list/filtering-sheet/filtering-criteria.model';

@Injectable({ providedIn: 'root' })
export class UiService {
  pageChanged = new Subject<string>();
  toolbarButtonClicked = new Subject<string>();
  holdingSorted = new Subject<SortingCriteriaModel>();
  displaySnackbar = new Subject<{ error: boolean; message: string }>();
  tradeListFiltered = new Subject<void>();
  tradeListFilterCleared = new Subject<void>();
}
