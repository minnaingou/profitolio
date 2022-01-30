import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UiService {
  pageChanged = new Subject<string>();
  toolbarButtonClicked = new Subject<string>();
  displaySnackbar = new Subject<{ error: boolean; message: string }>();
}
