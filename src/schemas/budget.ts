import { IAccount } from './account';
import { ICategory } from './category';
import { IPouchDB } from './pouchdb';
export interface IBudget extends IPouchDB{
  month: number;
  year: number;
  rows: Array<IParentRow>;
}

export interface IParentRow extends IPouchDB{
  budgetId?: string;
  categoryId?: string;
  category?: ICategory;
  isCollapsed?: boolean;
  children?: Array<IChildRow>;
}

export interface IChildRow extends IPouchDB{
  categoryId?: string;
  category?: ICategory;
  parentId?: string;
  budgeted?: number;
  activity?: number;
  balance?: number;
}
