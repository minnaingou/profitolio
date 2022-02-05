export interface FilteringCriteria {
  holdingsOnly?: boolean;
  types?: CheckboxModel[];
  symbols?: CheckboxModel[];
  exchanges?: CheckboxModel[];
  fromDate?: Date;
  toDate?: Date;
  minAmount?: number;
  maxAmount?: number;
}

export interface CheckboxModel {
  name: string;
  selected: boolean;
}
