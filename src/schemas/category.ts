import { IPouchDB } from "./pouchdb";

export interface ICategory extends IPouchDB{
  name: string;
  parentId?: any;
  isActive: boolean;
  isParent?: boolean;
}