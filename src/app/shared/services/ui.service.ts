import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { SortingCriteriaModel } from '../components/toolbar/sorting-menu/sorting-menu.component';

@Injectable({ providedIn: 'root' })
export class UiService {
  pageChanged = new Subject<string>();
  toolbarButtonClicked = new Subject<string>();
  holdingSorted = new Subject<SortingCriteriaModel>();
  displaySnackbar = new Subject<{ error: boolean; message: string }>();
  tradeListFiltered = new Subject<void>();
  tradeListFilterCleared = new Subject<void>();
}
