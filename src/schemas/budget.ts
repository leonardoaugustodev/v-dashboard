import { IAccount } from './account';
import { ICategory } from './category';
import { Database } from './database';
import { ITransaction } from './transaction';
export interface IBudget extends Database {
  month: number;
  year: number;
  rows?: Array<IBudgetRow>;
  transactions?: Array<ITransaction>;
  budgeted?: number;
  income?: number;
  available?: number;
  notBudgetLastMonth?: number;
  overspentLastMonth?: number;
}

export interface IBudgetRow extends Database {
  budgetId: string;
  categoryId: string;
  category?: ICategory;
  isCollapsed?: boolean;
  children: Array<IBudgetRow>;
  budgeted: number;
  activity: number;
  balance: number;
}

// export interface IParentRow extends Database {
//   budgetId: string;
//   categoryId: string;
//   isCollapsed?: boolean;
//   category?: ICategory;
//   children?: Array<IChildRow>;
// }

// export interface IChildRow extends Database {
//   budgetId: string;
//   categoryId: string;
//   parentId: string;
//   category?: ICategory;
//   budgeted?: number;
//   activity?: number;
//   balance?: number;
// }
