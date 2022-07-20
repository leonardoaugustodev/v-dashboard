import { Database } from "./database";

export interface IUser extends Database{
  uid: string
  accessToken: string,
  displayName: string,
  email: string,
  photoURL?: string
}