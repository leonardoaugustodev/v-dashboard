import { IAccount } from './account';
import { ICategory } from './category';
export interface IBudget {
  id?: any;
  month: number;
  year: number;
  rows: Array<IParentRow>;
}

export interface IParentRow {
  id?: string;
  category: ICategory;
  isCollapsed: boolean;
  children?: Array<IChildRow>;
}

export interface IChildRow {
  id?: string;
  category: ICategory;
  budgeted?: number;
  activity?: number;
  balance?: number;
}
