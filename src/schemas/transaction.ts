import { IAccount } from "./account";
import { ICategory } from "./category";
export interface ITransaction {
  id?: any;
  date: string;
  account: IAccount;
  payeeid?: string;
  memo?: string;
  category?: ICategory;
  inflow: number;
  outflow: number;
}