import { IAccount } from './account';
import { ICategory } from './category';
export interface IBudget {
  id?: any;
  month: string;
  year: string;
  rows: IBudgetRow[];
}

export interface IBudgetRow {
  id?: string;
  category: ICategory;
  budgeted: number;
  activity: number;
  balance: number;
}
