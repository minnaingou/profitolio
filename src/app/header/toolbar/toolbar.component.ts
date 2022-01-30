import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PAGE_HOME, TOOLBAR_ADD_DONE } from 'src/app/shared/ui-constants';
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

  onAdd() {
    this.router.navigate(['/new']);
  }

  onBack() {
    this.router.navigate(['../']);
  }

  onToolbarAction() {
    this.uiService.toolbarButtonClicked.next(TOOLBAR_ADD_DONE);
  }
}
