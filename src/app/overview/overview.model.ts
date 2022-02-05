import { Observable } from "rxjs";

export interface OverviewSection {
  title: string;
  lines: OverviewSectionItem[];
}

export interface OverviewSectionItem {
  icon: string;
  display: string; // row | column
  title: string;
  content: Promise<string | number>;
  currency: boolean;
}
