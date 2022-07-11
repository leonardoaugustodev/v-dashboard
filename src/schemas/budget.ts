import { IAccount } from './account';
import { ICategory } from './category';
import { Database } from './database';
export interface IBudget extends Database{
  month: number;
  year: number;
  rows?: Array<IParentRow>;
}

export interface IParentRow extends Database{
  budgetId: string;
  categoryId: string;
  isCollapsed?: boolean;
  category?: ICategory;
  children?: Array<IChildRow>;
}

export interface IChildRow extends Database{
  budgetId: string;
  categoryId: string;
  parentId: string;
  category?: ICategory;
  budgeted?: number;
  activity?: number;
  balance?: number;
}
