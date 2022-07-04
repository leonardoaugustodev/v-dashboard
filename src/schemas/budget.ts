import { IAccount } from './account';
import { ICategory } from './category';
export interface IBudget {
  id?: any;
  month: string;
  year: string;
  rows: Array<IParentRow>;
}

export interface IParentRow {
  id?: string;
  category: ICategory;
  children?: Array<IChildRow>;
}

export interface IChildRow {
  id?: string;
  category: ICategory;
  budgeted?: number;
  activity?: number;
  balance?: number;
}
