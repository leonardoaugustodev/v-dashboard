import { Database } from "./database";

export interface IAccount extends Database{
  name: string;
  type: string;
  on_budget: boolean;
  status: 'Active' | 'Inactive';
  balance: number;
}