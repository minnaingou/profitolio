import { Component, Input, OnInit } from '@angular/core';

import { OverviewSection } from 'src/app/portfolio/models/overview/overview.model';

@Component({
  selector: 'app-overview-item',
  templateUrl: './overview-item.component.html',
  styleUrls: ['./overview-item.component.css'],
})
export class OverviewItemComponent implements OnInit {
  @Input() section: OverviewSection;

  constructor() {}

  ngOnInit(): void {}
}
