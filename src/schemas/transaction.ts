import { IAccount } from "./account";
import { ICategory } from "./category";
import { Database } from "./database";
export interface ITransaction  extends Database{
  date: string;
  day: number;
  month: number;
  year: number;
  accountId?: string;
  account?: IAccount;
  payeeId?: string;
  memo?: string;
  categoryId?: string;
  category?: ICategory;
  inflow: number;
  outflow: number;
  cleared: boolean;
  isEditing?: boolean;
  selected? :boolean;
}