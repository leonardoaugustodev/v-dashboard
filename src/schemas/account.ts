import { Database } from "./database";

export interface IAccount extends Database{
  name: string;
  type: string;
  on_budget: boolean;
  status: string;
  balance: number;
}