import { Database } from "./database";

export interface ICategory extends Database{
  name: string;
  parentId?: any;
  isActive: boolean;
  isParent?: boolean;
}